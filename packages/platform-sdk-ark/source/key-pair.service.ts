import { Interfaces } from "@arkecosystem/crypto";
import { Keys as BaseKeys } from "@arkecosystem/crypto-identities";
import { Exceptions, IoC, Services } from "@arkecosystem/platform-sdk";

import { Bindings } from "./coin.contract";

@IoC.injectable()
export class KeyPairService extends Services.AbstractKeyPairService {
	@IoC.inject(Bindings.Crypto)
	private readonly config!: Interfaces.NetworkConfig;

	public async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.KeyPairDataTransferObject> {
		try {
			const { publicKey, privateKey } = BaseKeys.fromPassphrase(mnemonic, true);

			return { publicKey, privateKey };
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}

	public async fromWIF(wif: string): Promise<Services.KeyPairDataTransferObject> {
		try {
			const { publicKey, privateKey } = BaseKeys.fromWIF(wif, this.config.network);

			return { publicKey, privateKey };
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}
}