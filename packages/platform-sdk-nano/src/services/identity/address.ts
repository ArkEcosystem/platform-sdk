import { Contracts, Exceptions } from "@arkecosystem/platform-sdk";
import * as nanocurrency from "nanocurrency";
import { tools } from "nanocurrency-web";

import { deriveAccountKey } from "./helpers";

export class Address implements Contracts.Address {
	public async fromMnemonic(mnemonic: string, options?: Contracts.IdentityOptions): Promise<string> {
		return deriveAccountKey(mnemonic, options?.bip44?.account || 0).address;
	}

	public async fromMultiSignature(min: number, publicKeys: string[]): Promise<string> {
		throw new Exceptions.NotSupported(this.constructor.name, "fromMultiSignature");
	}

	public async fromPublicKey(publicKey: string, options?: Contracts.IdentityOptions): Promise<string> {
		return nanocurrency.deriveAddress(publicKey);
	}

	public async fromPrivateKey(privateKey: string, options?: Contracts.IdentityOptions): Promise<string> {
		return nanocurrency.deriveAddress(nanocurrency.derivePublicKey(privateKey));
	}

	public async fromWIF(wif: string): Promise<string> {
		throw new Exceptions.NotSupported(this.constructor.name, "fromWIF");
	}

	public async fromSecret(secret: string): Promise<string> {
		throw new Exceptions.NotSupported(this.constructor.name, "fromSecret");
	}

	public async validate(address: string): Promise<boolean> {
		return tools.validateAddress(address);
	}
}
