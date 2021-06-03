import { IReadWriteWallet } from "./wallet";

/**
 * Defines the options needed to generate a wallet.
 *
 * @interface IGenerateOptions
 */
export interface IGenerateOptions {
	coin: string;
	network: string;
	locale?: string;
}

/**
 * Defines the options for an import with a mnemonic.
 *
 * @interface IMnemonicOptions
 */
export interface IMnemonicOptions {
	coin: string;
	network: string;
	mnemonic: string;
	password?: string;
}

/**
 * Defines the options for an import with an address.
 *
 * @interface IAddressOptions
 */
export interface IAddressOptions {
	coin: string;
	network: string;
	address: string;
}

/**
 * Defines the options for an import with a public key.
 *
 * @interface IPublicKeyOptions
 */
export interface IPublicKeyOptions {
	coin: string;
	network: string;
	publicKey: string;
}

/**
 * Defines the options for an import with a private key.
 *
 * @interface IPrivateKeyOptions
 */
export interface IPrivateKeyOptions {
	coin: string;
	network: string;
	privateKey: string;
}

/**
 * Defines the options for an import with a BIP44 path.
 *
 * @interface IAddressWithDerivationPathOptions
 */
export interface IAddressWithDerivationPathOptions {
	coin: string;
	network: string;
	address: string;
	path: string;
}

/**
 * Defines the options for an import with a WIF.
 *
 * @interface IWifOptions
 */
export interface IWifOptions {
	coin: string;
	network: string;
	wif: string;
}

/**
 * Defines the options for an import with a WIF and password.
 *
 * @interface IWifWithEncryptionOptions
 */
export interface IWifWithEncryptionOptions {
	coin: string;
	network: string;
	wif: string;
	password: string;
}

/**
 * Defines the implementation contract for the wallet factory.
 *
 * @export
 * @interface IWalletFactory
 */
export interface IWalletFactory {
	/**
	 * Generates a wallet from a mnemonic.
	 *
	 * @param {IGenerateOptions} options
	 * @return {Promise<{ mnemonic: string; wallet: IReadWriteWallet }>}
	 * @memberof IWalletFactory
	 */
	generate(options: IGenerateOptions): Promise<{ mnemonic: string; wallet: IReadWriteWallet }>;

	/**
	 * Imports a wallet from a mnemonic, using the BIP39 proposal.
	 *
	 * @param {IMnemonicOptions} options
	 * @return {Promise<IReadWriteWallet>}
	 * @memberof IWalletFactory
	 */
	fromMnemonicWithBIP39(options: IMnemonicOptions): Promise<IReadWriteWallet>;

	/**
	 * Imports a wallet from a mnemonic, using the BIP44 proposal.
	 *
	 * @param {IMnemonicOptions} options
	 * @return {Promise<IReadWriteWallet>}
	 * @memberof IWalletFactory
	 */
	fromMnemonicWithBIP44(options: IMnemonicOptions): Promise<IReadWriteWallet>;

	/**
	 * Imports a wallet from a mnemonic, using the BIP49 proposal.
	 *
	 * @param {IMnemonicOptions} options
	 * @return {Promise<IReadWriteWallet>}
	 * @memberof IWalletFactory
	 */
	fromMnemonicWithBIP49(options: IMnemonicOptions): Promise<IReadWriteWallet>;

	/**
	 * Imports a wallet from a mnemonic, using the BIP84 proposal.
	 *
	 * @param {IMnemonicOptions} options
	 * @return {Promise<IReadWriteWallet>}
	 * @memberof IWalletFactory
	 */
	fromMnemonicWithBIP84(options: IMnemonicOptions): Promise<IReadWriteWallet>;

	/**
	 * Imports a wallet from an address.
	 *
	 * @param {IAddressOptions} options
	 * @return {Promise<IReadWriteWallet>}
	 * @memberof IWalletFactory
	 */
	fromAddress(options: IAddressOptions): Promise<IReadWriteWallet>;

	/**
	 * Imports a wallet from a public key.
	 *
	 * @param {IPublicKeyOptions} options
	 * @return {Promise<IReadWriteWallet>}
	 * @memberof IWalletFactory
	 */
	fromPublicKey(options: IPublicKeyOptions): Promise<IReadWriteWallet>;

	/**
	 * Imports a wallet from a private key.
	 *
	 * @param {IPrivateKeyOptions} options
	 * @return {Promise<IReadWriteWallet>}
	 * @memberof IWalletFactory
	 */
	fromPrivateKey(options: IPrivateKeyOptions): Promise<IReadWriteWallet>;

	/**
	 * Imports a wallet from a BIP44 path.
	 *
	 * @param {IAddressWithDerivationPathOptions} options
	 * @return {Promise<IReadWriteWallet>}
	 * @memberof IWalletFactory
	 */
	fromAddressWithDerivationPath(options: IAddressWithDerivationPathOptions): Promise<IReadWriteWallet>;

	/**
	 * Imports a wallet from a WIF.
	 *
	 * @param {IWifOptions} options
	 * @return {Promise<IReadWriteWallet>}
	 * @memberof IWalletFactory
	 */
	fromWIF(options: IWifOptions): Promise<IReadWriteWallet>;

	/**
	 * Imports a wallet from a WIF with a password.
	 *
	 * @param {IWifWithEncryptionOptions} options
	 * @return {Promise<IReadWriteWallet>}
	 * @memberof IWalletFactory
	 */
	fromWIFWithEncryption(options: IWifWithEncryptionOptions): Promise<IReadWriteWallet>;
}
