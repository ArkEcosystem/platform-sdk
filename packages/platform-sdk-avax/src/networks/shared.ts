import { Coins } from "@arkecosystem/platform-sdk";

export const transactions: Coins.NetworkManifestTransactions = {
	expirationType: "height",
	types: ["transfer", "vote"],
	fees: {
		type: "static",
		ticker: "AVAX",
	},
	utxo: true,
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
	Client: ["transactions", "wallet", "broadcast"],
	Identity: [
		"address.mnemonic.bip44",
		"address.privateKey",
		"address.validate",
		"keyPair.mnemonic.bip44",
		"keyPair.privateKey",
		"privateKey.mnemonic.bip44",
		"publicKey.mnemonic.bip44",
	],
	Link: ["block", "transaction", "wallet"],
	Message: ["sign", "verify"],
	Transaction: ["transfer", "vote"],
};
