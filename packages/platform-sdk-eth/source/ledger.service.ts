import { IoC, Services } from "@arkecosystem/platform-sdk";
import Ethereum from "@ledgerhq/hw-app-eth";

@IoC.injectable()
export class LedgerService extends Services.AbstractLedgerService {
	#ledger: Services.LedgerTransport;
	#transport!: Ethereum;

	public async connect(transport: Services.LedgerTransport): Promise<void> {
		this.#ledger = await transport.open();
		this.#transport = new Ethereum(this.#ledger);
	}

	public async disconnect(): Promise<void> {
		await this.#ledger.close();
	}

	public async getVersion(): Promise<string> {
		const { version } = await this.#transport.getAppConfiguration();

		return version;
	}

	public async getPublicKey(path: string): Promise<string> {
		const { publicKey } = await this.#transport.getAddress(path);

		return publicKey;
	}

	public async signTransaction(path: string, payload: Buffer): Promise<string> {
		return JSON.stringify(await this.#transport.signTransaction(path, payload));
	}

	public async signMessage(path: string, payload: Buffer): Promise<string> {
		return JSON.stringify(await this.#transport.signPersonalMessage(path, payload));
	}
}