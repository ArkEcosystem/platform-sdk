import { encrypt } from "bip38";
import { v4 as uuidv4 } from "uuid";
import { decode } from "wif";

import { Profile } from "../profiles/profile";
import { Wallet } from "./wallet";
import { ReadWriteWallet, WalletData } from "./wallet.models";

export class WalletFactory {
	#profile: Profile;

	public constructor(profile: Profile) {
		this.#profile = profile;
	}

	public async fromMnemonic(
		{ coin, network, mnemonic}:{coin: string,
		network: string,
		mnemonic: string,}
	): Promise<ReadWriteWallet> {
		const wallet: ReadWriteWallet = new Wallet(uuidv4(), {}, this.#profile);

		await wallet.setCoin(coin, network);

		if (wallet.canDeriveWithBIP39()) {
			await wallet.setIdentity(mnemonic);
		} else if (wallet.canDeriveWithBIP44()) {
			const addresses = await wallet.coin().identity().addressList().fromMnemonic(mnemonic, 50);// @TODO: derive until we no longer find addresses on the network?

			for (const { spendAddress } of addresses) {
				await wallet.addresses().fromAddress({ address: spendAddress });
			}
		}

		return wallet;
	}

	public async fromAddress(
		{ coin, network, address}:{coin: string,
		network: string,
		address: string,}
	): Promise<ReadWriteWallet> {
		const wallet: ReadWriteWallet = new Wallet(uuidv4(), {}, this.#profile);

		await wallet.setCoin(coin, network);
		await wallet.setAddress(address);

		return wallet;
	}

	public async fromPublicKey(
		{ coin, network, publicKey}:{	coin: string,
		network: string,
		publicKey: string,}
	): Promise<ReadWriteWallet> {
		const wallet: ReadWriteWallet = new Wallet(uuidv4(), {}, this.#profile);

		await wallet.setCoin(coin, network);
		await wallet.setAddress(await wallet.coin().identity().address().fromPublicKey(publicKey));

		return wallet;
	}

	public async fromPrivateKey(
		{ coin, network, privateKey}:{	coin: string,
		network: string,
		privateKey: string,}
	): Promise<ReadWriteWallet> {
		const wallet: ReadWriteWallet = new Wallet(uuidv4(), {}, this.#profile);

		await wallet.setCoin(coin, network);

		if (wallet.canDeriveWithBIP39()) {
			await wallet.setAddress(await wallet.coin().identity().address().fromPrivateKey(privateKey));
		} else if (wallet.canDeriveWithBIP44()) {
			const addresses = await wallet.coin().identity().addressList().fromPrivateKey(privateKey, 50); // @TODO: derive until we no longer find addresses on the network?

			for (const { spendAddress } of addresses) {
				await wallet.addresses().fromAddress({ address: spendAddress });
			}
		}

		return wallet;
	}

	public async fromAddressWithLedgerPath(
		{ coin, network, address, path}:{	coin: string,
		network: string,
		address: string,
		path: string,}
	): Promise<ReadWriteWallet> {
		// @TODO: eventually handle the whole process from slip44 path to public key to address

		const wallet: ReadWriteWallet = await this.fromAddress({ coin, network, address});

		wallet.data().set(WalletData.LedgerPath, path);

		return wallet;
	}

	public async fromMnemonicWithEncryption(
		{ coin, network, mnemonic, password}:{	coin: string,
		network: string,
		mnemonic: string,
		password: string,}
	): Promise<ReadWriteWallet> {
		const wallet: ReadWriteWallet = await this.fromMnemonic({coin, network, mnemonic});

		const { compressed, privateKey } = decode(await wallet.coin().identity().wif().fromMnemonic(mnemonic));

		wallet.data().set(WalletData.Bip38EncryptedKey, encrypt(privateKey, compressed, password));

		return wallet;
	}
}
