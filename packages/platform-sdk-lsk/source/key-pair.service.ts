import { Exceptions, IoC, Services } from "@arkecosystem/platform-sdk";
import { getPrivateAndPublicKeyFromPassphrase } from "@liskhq/lisk-cryptography";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { abort_if, abort_unless } from "@arkecosystem/platform-sdk-support";

@IoC.injectable()
export class KeyPairService extends Services.AbstractKeyPairService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.KeyPairDataTransferObject> {
		try {
			abort_unless(BIP39.validate(mnemonic), "The given value is not BIP39 compliant.");

			const { publicKey, privateKey } = getPrivateAndPublicKeyFromPassphrase(mnemonic);

			return { publicKey, privateKey: privateKey.slice(0, privateKey.length / 2) };
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}

	public override async fromSecret(secret: string): Promise<Services.KeyPairDataTransferObject> {
		try {
			abort_if(BIP39.validate(secret), "The given value is BIP39 compliant. Please use [fromMnemonic] instead.");

			const { publicKey, privateKey } = getPrivateAndPublicKeyFromPassphrase(secret);

			return { publicKey, privateKey: privateKey.slice(0, privateKey.length / 2) };
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}
}
