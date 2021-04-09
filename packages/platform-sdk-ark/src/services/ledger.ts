import { ARKTransport } from "@arkecosystem/ledger-transport";
import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { HDKey } from "@arkecosystem/platform-sdk-crypto";

import { WalletData } from "../dto";
import { ClientService } from "./client";
import { IdentityService } from "./identity";

const chunk = <T>(value: T[], size: number) =>
	Array.from({ length: Math.ceil(value.length / size) }, (v, i) => value.slice(i * size, i * size + size));

const formatLedgerDerivationPath = (scheme: LedgerDerivationScheme) =>
	`${scheme.purpose || 44}'/${scheme.coinType}'/${scheme.account || 0}'/${scheme.change || 0}/${scheme.address || 0}`;

export type LedgerDerivationScheme = {
	coinType: number;
	purpose?: number;
	account?: number;
	change?: number;
	address?: number;
};

export const createRange = (start: number, size: number) => Array.from({ length: size }, (_, i) => i + size * start);

export class LedgerService implements Contracts.LedgerService {
	readonly #config: Coins.Config;
	readonly #identity: IdentityService;
	readonly #client: ClientService;
	#ledger: Contracts.LedgerTransport;
	#transport!: ARKTransport;

	private constructor(config: Coins.Config, identity: IdentityService, client: ClientService) {
		this.#config = config;
		this.#identity = identity;
		this.#client = client;
	}

	public static async __construct(config: Coins.Config): Promise<LedgerService> {
		return new LedgerService(
			config,
			await IdentityService.__construct(config),
			await ClientService.__construct(config),
		);
	}

	public async __destruct(): Promise<void> {
		await this.disconnect();
	}

	public async connect(transport: Contracts.LedgerTransport): Promise<void> {
		this.#ledger = await transport.open();
		this.#transport = new ARKTransport(this.#ledger);
	}

	public async disconnect(): Promise<void> {
		await this.#ledger.close();
	}

	public async getVersion(): Promise<string> {
		return this.#transport.getVersion();
	}

	public async getPublicKey(path: string): Promise<string> {
		return this.#transport.getPublicKey(path);
	}

	public async getExtendedPublicKey(path: string): Promise<string> {
		return this.#transport.getExtPublicKey(path);
	}

	public async signTransaction(path: string, payload: Buffer): Promise<string> {
		return this.#transport.signTransactionWithSchnorr(path, payload);
	}

	public async signMessage(path: string, payload: Buffer): Promise<string> {
		return this.#transport.signMessageWithSchnorr(path, payload);
	}

	public async scan(options?: { useLegacy: boolean }): Promise<Contracts.LedgerWalletList> {
		const pageSize = 5;
		let page = 0;
		const slip44 = this.#config.get<number>("network.crypto.slip44");

		const addressCache: Record<string, { address: string; publicKey: string }> = {};
		let wallets: Contracts.WalletData[] = [];

		let hasMore = true;
		do {
			const addresses: string[] = [];

			/**
			 * @remarks
			 * This needs to be used to support the borked BIP44 implementation from the v2 desktop wallet.
			 */
			if (options?.useLegacy) {
				for (const accountIndex of createRange(page, pageSize)) {
					const path: string = formatLedgerDerivationPath({ coinType: slip44, account: accountIndex });
					const publicKey: string = await this.getPublicKey(path);
					const address: string = await this.#identity.address().fromPublicKey(publicKey);

					addresses.push(address);

					addressCache[path] = { address, publicKey };
				}

				const collection = await this.#client.wallets({ addresses });

				wallets = wallets.concat(collection.items());

				hasMore = collection.isNotEmpty();
			} else {
				const path = `m/44'/${slip44}'/0'`;

				/**
				 * @remarks
				 * This is the new BIP44 compliant derivation which will be used by default.
				 */
				const compressedPublicKey = await this.getExtendedPublicKey(path);

				for (const addressIndex of createRange(page, pageSize)) {
					const publicKey: string = HDKey.fromCompressedPublicKey(compressedPublicKey)
						.derive(`m/0/${addressIndex}`)
						.publicKey.toString("hex");

					const address: string = await this.#identity
						.address()
						.fromPublicKey(publicKey);

					addresses.push(address);

					addressCache[path] = { address, publicKey };
				}

				const collections = await Promise.all(
					chunk(addresses, 50).map((addresses: string[]) => this.#client.wallets({ addresses })),
				);

				for (const collection of collections) {
					wallets = wallets.concat(collection.items());

					hasMore = collection.isNotEmpty();
				}
			}

			page++;
		} while (hasMore);

		// Create a mapping of paths and wallets that have been found.
		const result: Contracts.LedgerWalletList = {};

		for (const [path, { address, publicKey }] of Object.entries(addressCache)) {
			const matchingWallet: Contracts.WalletData | undefined = wallets.find(
				(wallet: Contracts.WalletData) => wallet.address() === address,
			);

			if (matchingWallet === undefined) {
				result[path] = new WalletData({
					address,
					publicKey,
					balance: 0,
				});
			} else {
				result[path] = matchingWallet;
			}
		}

		return result;
	}
}
