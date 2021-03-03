import { Coins, Contracts, Exceptions } from "@arkecosystem/platform-sdk";
import { BinTools } from "avalanche";

import { cb58Encode, keyPairFromMnemonic, useKeychain } from "../helpers";

export class Keys implements Contracts.Keys {
	readonly #config: Coins.Config;

	public constructor(config: Coins.Config) {
		this.#config = config;
	}

	public async fromMnemonic(mnemonic: string, options?: Contracts.IdentityOptions): Promise<Contracts.KeyPair> {
		const keyPair = keyPairFromMnemonic(this.#config, mnemonic);

		return {
			publicKey: cb58Encode(keyPair.getPublicKey()),
			privateKey: cb58Encode(keyPair.getPrivateKey()),
		};
	}

	public async fromPrivateKey(privateKey: string): Promise<Contracts.KeyPair> {
		const keyPair = useKeychain(this.#config).importKey(BinTools.getInstance().cb58Decode(privateKey));

		return {
			publicKey: cb58Encode(keyPair.getPublicKey()),
			privateKey: cb58Encode(keyPair.getPrivateKey()),
		};
	}

	public async fromWIF(wif: string): Promise<Contracts.KeyPair> {
		throw new Exceptions.NotSupported(this.constructor.name, "fromWIF");
	}
}
