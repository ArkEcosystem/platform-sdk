import { decrypt, encrypt } from "bip38";
import { decode } from "wif";

import { IReadWriteWallet, WalletData } from "../../../../contracts";
import { IWalletImportFormat } from "../../../../contracts/wallets/services/wif";

export class WalletImportFormat implements IWalletImportFormat {
	readonly #wallet: IReadWriteWallet;

	public constructor(wallet: IReadWriteWallet) {
		this.#wallet = wallet;
	}

	/**
	 * If a wallet makes use of a WIF you will need to decrypt it and
	 * pass it the transaction signing service instead of asking the
	 * user for a BIP39 plain text passphrase.
	 *
	 * @see https://github.com/bitcoinjs/bip38
	 */
	public async get(password: string): Promise<string> {
		const encryptedKey: string | undefined = this.#wallet.data().get(WalletData.Bip38EncryptedKey);

		if (encryptedKey === undefined) {
			throw new Error("This wallet does not use BIP38 encryption.");
		}

		return this.#wallet.coin().identity().wif().fromPrivateKey(decrypt(encryptedKey, password).privateKey.toString("hex"));
	}

	public async set(mnemonic: string, password: string): Promise<void> {
		const { compressed, privateKey } = decode(await this.#wallet.coin().identity().wif().fromMnemonic(mnemonic));

		this.#wallet.data().set(WalletData.Bip38EncryptedKey, encrypt(privateKey, compressed, password));
	}

	public exists(): boolean {
		return this.#wallet.data().has(WalletData.Bip38EncryptedKey);
	}
}