import { Coins, Contracts } from "@arkecosystem/platform-sdk";

import { Address } from "./address";
import { Keys } from "./keys";
import { PrivateKey } from "./private-key";
import { PublicKey } from "./public-key";
import { WIF } from "./wif";

export class IdentityService implements Contracts.IdentityService {
	readonly #network: string;

	private constructor(network: string) {
		this.#network = network;
	}

	public static async construct(config: Coins.Config): Promise<IdentityService> {
		return new IdentityService(config.get("network"));
	}

	public async destruct(): Promise<void> {
		//
	}

	public address(): Address {
		return new Address(this.#network);
	}

	public publicKey(): PublicKey {
		return new PublicKey();
	}

	public privateKey(): PrivateKey {
		return new PrivateKey();
	}

	public wif(): WIF {
		return new WIF();
	}

	public keys(): Keys {
		return new Keys();
	}
}
