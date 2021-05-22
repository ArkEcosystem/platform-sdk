import { Coins } from "@arkecosystem/platform-sdk";

import { transactions, importMethods, featureFlags } from "../shared";

const network: Coins.NetworkManifest = {
	id: "worbli.testnet",
	type: "test",
	name: "Testnet",
	coin: "Worbli",
	explorer: "https://worbli-test.bloks.io/",
	currency: {
		ticker: "WBI",
		symbol: "WBI",
	},
	fees: {
		type: "free",
		ticker: "WBI",
	},
	constants: {
		networkId: "0d1ba39b44e70e9c36b74d60677ef3b686bd4347ade092b816886a6a35ddb6f7",
		slip44: 194,
		bech32: "WBI",
		signingMethods: {
			privateKey: true,
		},
		expirationType: "height",
	},
	networking: {
		hosts: ["https://worbli-testnet.eosblocksmith.io", "https://worbli-testnet.eosphere.io"],
	},
	featureFlags: {
		Client: {
			wallet: true,
		},
		Link: {
			block: true,
			transaction: true,
			wallet: true,
		},
		Message: {
			sign: true,
			verify: true,
		},
		Transaction: {
			transfer: { default: true },
		},
		Derivation: {
			bip39: true,
			bip44: true,
		},
	},
	transactions,
	importMethods,
	featureFlags,
};

export default network;
