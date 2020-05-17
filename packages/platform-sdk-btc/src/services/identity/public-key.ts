import { Coins, Contracts, Exceptions, Utils } from "@arkecosystem/platform-sdk";
import Bitcoin from "bitcore-lib";

export class PublicKey implements Contracts.PublicKey {
	public async fromPassphrase(passphrase: string): Promise<string> {
		return Utils.BIP44.deriveMasterKey(passphrase).publicKey.toString("hex");
	}

	public async fromMultiSignature(min: number, publicKeys: string[]): Promise<string> {
		throw new Exceptions.NotSupported(this.constructor.name, "fromMultiSignature");
	}

	public async fromWIF(wif: string): Promise<string> {
		return Bitcoin.PrivateKey.fromWIF(wif).toPublicKey().toString();
	}
}
