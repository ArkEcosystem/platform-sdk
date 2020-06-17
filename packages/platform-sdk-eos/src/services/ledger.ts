import { Coins, Contracts, Exceptions } from "@arkecosystem/platform-sdk";
import { BIP44 } from "@arkecosystem/platform-sdk-crypto";

export class LedgerService implements Contracts.LedgerService {
	#ledger: Contracts.LedgerTransport;

	public static async construct(config: Coins.Config): Promise<LedgerService> {
		return new LedgerService();
	}

	public async destruct(): Promise<void> {
		await this.disconnect();
	}

	public async connect(transport: Contracts.LedgerTransport): Promise<void> {
		this.#ledger = await transport.create();
	}

	public async disconnect(): Promise<void> {
		await this.#ledger.close();
	}

	public async getVersion(): Promise<string> {
		const result = await this.#ledger.send(0xd4, 0x06, 0x00, 0x00);

		return `${result[1]}.${result[2]}.${result[3]}`;
	}

	public async getPublicKey(path: string): Promise<string> {
		const result = await this.#ledger.send(0xd4, 0x02, 0x00, 0x00, this.eosBip44Parse(path));

		return result.slice(1, 1 + result[0]).toString("hex");
	}

	public async signTransaction(path: string, payload: Buffer): Promise<string> {
		const signature = await this.eosSignTransaction(path, payload);

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
	 * EOS-like Bip44 Parsing
	 */
	private eosBip44Parse(path: string): Buffer {
		const elements: number[] = Object.values(BIP44.parse(path));
		const payload = Buffer.alloc(1 + elements.length * 4);
		payload[0] = elements.length;
		elements.forEach((element: number, index: number) => {
			payload.writeUInt32BE((element += index < 3 ? 0x80000000 : 0), 1 + 4 * index);
		});

		return payload;
	}

	/**
	 * EOS-like Transaction Signing
	 */
	private async eosSignTransaction(path: string, rawTxHex: Buffer): Promise<string> {
		const eosPaths = this.eosBip44Parse(path);
		const buffer = Buffer.concat([eosPaths, rawTxHex]);

		const chunkSize = 150;
		const chunks = Array.from({ length: Math.ceil(buffer.length / chunkSize) }, (v, i) => {
			return buffer.slice(i * chunkSize, i * chunkSize + chunkSize);
		});

		let response = Buffer.alloc(65);
		for (let index = 0; index < chunks.length; ++index) {
			const chunk = chunks[index];
			await this.#ledger.send(0xd4, 0x04, index === 0 ? 0x00 : 0x80, 0x00, chunk).then((apduResponse) => {
				response = apduResponse;
				return response;
			});
		}

		return response.slice(0, response.length - 2).toString("hex");
	}
}
