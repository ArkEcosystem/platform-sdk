import { Coins } from "@arkecosystem/platform-sdk";

export const transactions: Coins.NetworkManifestTransactions = {
	expirationType: "height",
	types: ["transfer"],
	fees: {
		type: "weight",
		ticker: "DOT",
	},
	memo: true,
};

export const importMethods: Coins.NetworkManifestImportMethods = {
	address: {
		default: false,
		permissions: ["read"],
	},
	bip39: {
		default: true,
		permissions: ["read", "write"],
	},
	publicKey: {
		default: false,
		permissions: ["read"],
	},
};

export const featureFlags: Coins.NetworkManifestFeatureFlags = {
	Client: ["wallet", "broadcast"],
	Identity: [
		"address.mnemonic.bip39",
		"address.validate",
		"keyPair.mnemonic.bip39",
		"privateKey.mnemonic.bip39",
		"publicKey.mnemonic.bip39",
		"wif.mnemonic.bip39",
	],
	Link: ["block", "transaction", "wallet"],
	Message: ["sign", "verify"],
	Transaction: ["transfer"],
};
