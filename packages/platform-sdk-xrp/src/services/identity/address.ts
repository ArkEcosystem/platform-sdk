import { Contracts, Exceptions, Utils } from "@arkecosystem/platform-sdk";
import { deriveAddress, deriveKeypair } from "ripple-keypairs";

export class Address implements Contracts.Address {
	public async fromPassphrase(passphrase: string): Promise<string> {
		return deriveAddress(deriveKeypair(BIP39.normalize(passphrase)).publicKey);
	}

	public async fromMultiSignature(min: number, publicKeys: string[]): Promise<string> {
		throw new Exceptions.NotSupported(this.constructor.name, "fromMultiSignature");
	}

	public async fromPublicKey(publicKey: string): Promise<string> {
		return deriveAddress(publicKey);
	}

	public async fromPrivateKey(privateKey: string): Promise<string> {
		throw new Exceptions.NotSupported(this.constructor.name, "fromPrivateKey");
	}

	public async fromWIF(wif: string): Promise<string> {
		throw new Exceptions.NotSupported(this.constructor.name, "fromWIF");
	}
}
