import { ARKTransport } from "@arkecosystem/ledger-transport";
import { Coins, Contracts, IoC, Services } from "@arkecosystem/platform-sdk";
import { BIP44, HDKey } from "@arkecosystem/platform-sdk-crypto";

import { WalletData } from "../dto";
import { chunk, createRange, formatLedgerDerivationPath } from "./ledger.helpers";

@IoC.injectable()
export class LedgerService extends Services.AbstractLedgerService {
	@IoC.inject(IoC.BindingType.ConfigRepository)
	private readonly configRepository!: Coins.ConfigRepository;

	@IoC.inject(IoC.BindingType.ClientService)
	private readonly clientService!: Services.ClientService;

	@IoC.inject(IoC.BindingType.AddressService)
	private readonly addressService!: Services.AddressService;

	#ledger!: Services.LedgerTransport;
	#transport!: ARKTransport;

	public async connect(transport: Services.LedgerTransport): Promise<void> {
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

	public async scan(options?: { useLegacy: boolean; startPath?: string }): Promise<Services.LedgerWalletList> {
		const pageSize = 5;
		let page = 0;
		const slip44 = this.configRepository.get<number>("network.constants.slip44");

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
					const { address } = await this.addressService.fromPublicKey(publicKey);

					addresses.push(address);

					addressCache[path] = { address, publicKey };
				}

				const collection = await this.clientService.wallets({ addresses });

				wallets = wallets.concat(collection.items());

				hasMore = collection.isNotEmpty();
			} else {
				const path = `m/44'/${slip44}'/0'`;
				let initialAddressIndex = 0;

				if (options?.startPath) {
					/*
					 * Get the address index from expected format `m/purpose'/coinType'/account'/change/addressIndex`
					 */
					initialAddressIndex = BIP44.parse(options.startPath).addressIndex + 1;
				}

				/**
				 * @remarks
				 * This is the new BIP44 compliant derivation which will be used by default.
				 */
				const compressedPublicKey = await this.getExtendedPublicKey(path);

				for (const addressIndexIterator of createRange(page, pageSize)) {
					const addressIndex = initialAddressIndex + addressIndexIterator;
					const publicKey: string = HDKey.fromCompressedPublicKey(compressedPublicKey)
						.derive(`m/0/${addressIndex}`)
						.publicKey.toString("hex");

					const { address } = await this.addressService.fromPublicKey(publicKey);

					addresses.push(address);

					addressCache[`${path}/0/${addressIndex}`] = { address, publicKey };
				}

				const collections = await Promise.all(
					chunk(addresses, 50).map((addresses: string[]) => this.clientService.wallets({ addresses })),
				);

				for (const collection of collections) {
					wallets = wallets.concat(collection.items());

					hasMore = collection.isNotEmpty();
				}
			}

			page++;
		} while (hasMore);

		// Create a mapping of paths and wallets that have been found.
		const cold: Services.LedgerWalletList = {};
		const used: Services.LedgerWalletList = {};

		for (const [path, { address, publicKey }] of Object.entries(addressCache)) {
			const matchingWallet: Contracts.WalletData | undefined = wallets.find(
				(wallet: Contracts.WalletData) => wallet.address() === address,
			);

			if (matchingWallet === undefined) {
				if (Object.keys(cold).length > 0) {
					continue;
				}

				cold[path] = new WalletData({
					address,
					publicKey,
					balance: 0,
				});
			} else {
				used[path] = matchingWallet;
			}
		}

		return { ...cold, ...used };
	}
}
