import { Contracts, Exceptions, Services } from "@arkecosystem/platform-sdk";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import StellarHDWallet from "stellar-hd-wallet";
import Stellar from "stellar-sdk";

export class KeyPairService extends Services.AbstractKeyPairService {
	public async fromMnemonic(
		mnemonic: string,
		options?: Contracts.IdentityOptions,
	): Promise<Contracts.KeyPairDataTransferObject> {
		try {
			const source = StellarHDWallet.fromMnemonic(BIP39.normalize(mnemonic));

			return {
				publicKey: source.getPublicKey(options?.bip44?.account || 0),
				privateKey: source.getSecret(options?.bip44?.account || 0),
				// @TODO: return path
			};
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}

	public async fromPrivateKey(privateKey: string): Promise<Contracts.KeyPairDataTransferObject> {
		try {
			const source = Stellar.Keypair.fromSecret(privateKey);

			return {
				publicKey: source.publicKey(),
				privateKey: source.secret(),
			};
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}
}
