import { Contracts, Exceptions } from "@arkecosystem/platform-sdk";

export class PrivateKey implements Contracts.PrivateKey {
	public async fromMnemonic(mnemonic: string): Promise<string> {
		throw new Exceptions.NotSupported(this.constructor.name, "fromMnemonic");
	}

	public async fromWIF(wif: string): Promise<string> {
		throw new Exceptions.NotSupported(this.constructor.name, "fromWIF");
	}
}
