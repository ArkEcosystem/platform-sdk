import { Coins, Contracts, Exceptions } from "@arkecosystem/platform-sdk";
import { BIP44 } from "@arkecosystem/platform-sdk-crypto";
import LedgerTransport from "@ledgerhq/hw-transport-node-hid-singleton";

export class LedgerService implements Contracts.LedgerService {
	#ledger: LedgerTransport;
	#transport: any;
	#bip44SessionPath: string;

	private constructor(transport: Contracts.LedgerTransport) {
		this.#ledger = transport;
		this.#bip44SessionPath = "";
	}

	public static async construct(config: Coins.Config): Promise<LedgerService> {
		try {
			return new LedgerService(config.get("services.ledger.transport"));
		} catch {
			return new LedgerService(LedgerTransport);
		}
	}

	public async destruct(): Promise<void> {
		await this.disconnect();
	}

	public async connect(): Promise<void> {
		this.#ledger = await this.#ledger.create();
	}

	public async disconnect(): Promise<void> {
		await this.#ledger.close();
	}

	public async getVersion(): Promise<string> {
		const result = await this.#ledger.send(0xb0, 0x01, 0x00, 0x00);

		return result.toString("utf-8").match(new RegExp("([0-9].[0-9].[0-9])", "g")).toString();
	}

	public async getPublicKey(path: string): Promise<string> {
		this.#bip44SessionPath = path;
		const result = await this.#ledger.send(0x80, 0x04, 0x00, 0x00, this.neoBIP44(path));

		return result.toString("hex").substring(0, 130);
	}

	public async signTransaction(path: string, payload: Buffer): Promise<string> {
		if (this.#bip44SessionPath != path || this.#bip44SessionPath.length == 0) {
			throw new Error(
				`Bip44 Path [${path}] must match the session path [${
					this.#bip44SessionPath
				}] stored during 'getPublicKey' .`,
			);
		}

		const signature = await this.neoSignTransaction(this.#ledger, path, payload);

		return signature;
	}

	public async signTransactionWithSchnorr(path: string, payload: Buffer): Promise<string> {
		throw new Exceptions.NotImplemented(this.constructor.name, "signTransactionWithSchnorr");
	}

	public async signMessage(path: string, payload: Buffer): Promise<string> {
		throw new Exceptions.NotImplemented(this.constructor.name, "signMessage");
	}

	public async signMessageWithSchnorr(path: string, payload: Buffer): Promise<string> {
		throw new Exceptions.NotImplemented(this.constructor.name, "signMessageWithSchnorr");
	}

	/**
	 * Neo-like Bip44 Parsing
	 * modified from:
	 * - https://github.com/CityOfZion/neon-js/blob/master/packages/neon-ledger/src/BIP44.ts
	 */
	private neoBIP44(path: string): Buffer {
		const parsedPath = BIP44.parse(path);
		const accountHex = this.to8BitHex(parsedPath.account + 0x80000000);
		const changeHex = this.to8BitHex(parsedPath.change);
		const addressHex = this.to8BitHex(parsedPath.addressIndex);

		return Buffer.from("8000002C" + "80000378" + accountHex + changeHex + addressHex, "hex");
	}

	/**
	 * Neo-like Bip44 Element to8BitHex
	 * modified from:
	 * - https://github.com/CityOfZion/neon-js/blob/master/packages/neon-ledger/src/BIP44.ts
	 */
	private to8BitHex(num: number): string {
		const hex = num.toString(16);
		return "0".repeat(8 - hex.length) + hex;
	}

	/**
	 * Neo-like Transaction Signing
	 * modified from:
	 * - https://github.com/CityOfZion/neon-js/blob/master/packages/neon-ledger/src/main.ts.ts
	 */
	private async neoSignTransaction(transport: LedgerTransport, path: string, payload: Buffer): Promise<string> {
		const chunks: string[] = payload.toString().match(/.{1,510}/g) || [];

		for (let i = 0; i < chunks.length - 1; i++) {
			await this.#ledger.send(0x80, 0x02, 0x00, 0x00, Buffer.from(chunks[i], "hex"));
		}

		const result = await this.#ledger.send(0x80, 0x02, 0x80, 0x00, Buffer.from(chunks[chunks.length - 1], "hex"));

		return result.toString("hex").match(new RegExp(".*[^9000]", "g")).toString();
	}
}
