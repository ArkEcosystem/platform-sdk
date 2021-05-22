import { Coins } from "@arkecosystem/platform-sdk";

import { transactions, importMethods, featureFlags } from "../shared";

const network: Coins.NetworkManifest = {
	id: "lsk.mainnet",
	type: "live",
	name: "Mainnet",
	coin: "Lisk",
	explorer: "https://explorer.lisk.io/",
	currency: {
		ticker: "LSK",
		symbol: "LSK",
	},
	fees: {
		type: "static",
		ticker: "LSK",
	},
	constants: {
		networkId: "ed14889723f24ecc54871d058d98ce91ff2f973192075c0155ba2b7b70ad2511",
		slip44: 134,
		expirationType: "height",
	},
	networking: {
		hosts: [
			"https://hub21.lisk.io",
			"https://hub22.lisk.io",
			"https://hub23.lisk.io",
			"https://hub24.lisk.io",
			"https://hub25.lisk.io",
			"https://hub26.lisk.io",
			"https://hub27.lisk.io",
			"https://hub28.lisk.io",
			"https://hub31.lisk.io",
			"https://hub32.lisk.io",
			"https://hub33.lisk.io",
			"https://hub34.lisk.io",
			"https://hub35.lisk.io",
			"https://hub36.lisk.io",
			"https://hub37.lisk.io",
			"https://hub38.lisk.io",
		],
	},
	governance: {
		voting: {
			enabled: true,
			delegateCount: 101,
			maximumPerWallet: 101,
			maximumPerTransaction: 33,
		},
	},
	featureFlags: {
		Client: {
			transaction: true,
			transactions: true,
			wallet: true,
			wallets: true,
			delegate: true,
			delegates: true,
			broadcast: true,
		},
		Identity: {
			address: {
				mnemonic: true,
				publicKey: true,
			},
			publicKey: {
				mnemonic: true,
			},
			privateKey: {
				mnemonic: true,
			},
			keyPair: {
				mnemonic: true,
			},
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
			secondSignature: { default: true },
			delegateRegistration: { default: true },
			vote: { default: true },
			multiSignature: { default: true },
		},
		Derivation: {
			bip39: true,
			bip44: true,
		},
	},
	transactionTypes: ["delegate-registration", "multi-signature", "second-signature", "transfer", "vote"],
};

export default network;
