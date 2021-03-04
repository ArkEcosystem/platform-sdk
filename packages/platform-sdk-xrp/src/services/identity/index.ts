import { Coins, Contracts } from "@arkecosystem/platform-sdk";

import { Address } from "./address";
import { AddressList } from "./address-list";
import { Keys } from "./keys";
import { PrivateKey } from "./private-key";
import { PublicKey } from "./public-key";
import { WIF } from "./wif";

export class IdentityService implements Contracts.IdentityService {
	public static async __construct(config: Coins.Config): Promise<IdentityService> {
		return new IdentityService();
	}

	public async __destruct(): Promise<void> {
		//
	}

	public address(): Address {
		return new Address();
	}

	public addressList(): AddressList {
		return new AddressList();
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
