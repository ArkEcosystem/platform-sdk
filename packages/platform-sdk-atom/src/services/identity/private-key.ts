import { Coins, Contracts, Exceptions } from "@arkecosystem/platform-sdk";

import { Keys } from "./keys";

export class PrivateKey implements Contracts.PrivateKey {
	readonly #config: Coins.Config;

	public constructor(config: Coins.Config) {
		this.#config = config;
	}

	public async fromMnemonic(mnemonic: string): Promise<string> {
		const keys = new Keys(this.#config);
		const { privateKey } = await keys.fromMnemonic(mnemonic);

		if (!privateKey) {
			throw new Error("Failed to derive the private key.");
		}

		return privateKey;
	}

	public async fromWIF(wif: string): Promise<string> {
		throw new Exceptions.NotSupported(this.constructor.name, "fromWIF");
	}
}
