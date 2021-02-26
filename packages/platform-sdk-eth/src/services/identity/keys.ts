import { Coins, Contracts, Exceptions } from "@arkecosystem/platform-sdk";
import { Buffoon } from "@arkecosystem/platform-sdk-crypto";
import Wallet from "ethereumjs-wallet";

import { createWallet } from "./utils";

export class Keys implements Contracts.Keys {
	readonly #config: Coins.Config;

	public constructor(config: Coins.Config) {
		this.#config = config;
	}

	public async fromMnemonic(mnemonic: string, options?: Contracts.IdentityOptions): Promise<Contracts.KeyPair> {
		try {
			const wallet: Wallet = createWallet(
				mnemonic,
				this.#config.get(Coins.ConfigKey.Slip44),
				options?.bip44.account || 0,
				options?.bip44.change || 0,
				options?.bip44.addressIndex || 0,
			);

			return {
				publicKey: wallet.getPublicKey().toString("hex"),
				privateKey: wallet.getPrivateKey().toString("hex"),
			};
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}

	public async fromPrivateKey(privateKey: string): Promise<Contracts.KeyPair> {
		try {
			const wallet: Wallet = Wallet.fromPrivateKey(Buffoon.fromHex(privateKey));

			return {
				publicKey: wallet.getPublicKey().toString("hex"),
				privateKey: wallet.getPrivateKey().toString("hex"),
			};
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}

	public async fromWIF(wif: string): Promise<Contracts.KeyPair> {
		throw new Exceptions.NotSupported(this.constructor.name, "fromWIF");
	}
}
