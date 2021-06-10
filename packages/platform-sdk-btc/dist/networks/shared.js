"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.explorer = exports.featureFlags = exports.importMethods = exports.transactions = void 0;
exports.transactions = {
	expirationType: "height",
	types: ["transfer"],
	fees: {
		type: "dynamic",
		ticker: "BTC",
	},
	utxo: true,
};
exports.importMethods = {
	address: {
		default: false,
		permissions: ["read"],
	},
	bip38: {
		default: false,
		permissions: ["read", "write"],
	},
	bip39: {
		default: false,
		permissions: ["read", "write"],
	},
	bip44: {
		default: false,
		permissions: ["read", "write"],
	},
	bip49: {
		default: false,
		permissions: ["read", "write"],
	},
	bip84: {
		default: true,
		permissions: ["read", "write"],
	},
	publicKey: {
		default: false,
		permissions: ["read"],
	},
	privateKey: {
		default: false,
		permissions: ["read", "write"],
	},
	wif: {
		default: false,
		permissions: ["read", "write"],
	},
};
exports.featureFlags = {
	Client: ["transaction", "wallet", "broadcast"],
	Identity: [
		"address.mnemonic.bip39",
		"address.mnemonic.bip44",
		"address.mnemonic.bip49",
		"address.mnemonic.bip84",
		"address.privateKey",
		"address.publicKey",
		"address.validate",
		"address.wif",
		"keyPair.mnemonic.bip39",
		"keyPair.mnemonic.bip44",
		"keyPair.mnemonic.bip49",
		"keyPair.mnemonic.bip84",
		"keyPair.privateKey",
		"keyPair.wif",
		"privateKey.mnemonic.bip39",
		"privateKey.mnemonic.bip44",
		"privateKey.mnemonic.bip49",
		"privateKey.mnemonic.bip84",
		"privateKey.wif",
		"publicKey.mnemonic.bip39",
		"publicKey.mnemonic.bip44",
		"publicKey.mnemonic.bip49",
		"publicKey.mnemonic.bip84",
		"publicKey.wif",
		"wif.mnemonic.bip39",
		"wif.mnemonic.bip44",
		"wif.mnemonic.bip49",
		"wif.mnemonic.bip84",
	],
	Link: ["block", "transaction", "wallet"],
	Message: ["sign", "verify"],
	Transaction: ["transfer"],
};
exports.explorer = {
	block: "block/{0}",
	transaction: "tx/{0}",
	wallet: "address/{0}",
};
//# sourceMappingURL=shared.js.map