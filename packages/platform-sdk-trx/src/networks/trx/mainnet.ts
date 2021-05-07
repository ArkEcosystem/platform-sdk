import { Coins } from "@arkecosystem/platform-sdk";

const network: Coins.NetworkManifest = {
	id: "trx.mainnet",
	type: "live",
	name: "Mainnet",
	coin: "TRON",
	explorer: "https://tronscan.org/#/",
	currency: {
		ticker: "TRX",
		symbol: "TRX",
	},
	crypto: {
		slip44: 195,
		signingMethods: {
			mnemonic: true,
			privateKey: true,
		},
		expirationType: "height",
	},
	networking: {
		hosts: ["https://api.trongrid.io"],
		hostsArchival: ["https://apilist.tronscan.org/api"],
	},
	governance: {
		voting: {
			enabled: false,
			delegateCount: 0,
			maximumPerWallet: 0,
			maximumPerTransaction: 0,
		},
	},
	featureFlags: {
		Client: {
			transaction: true,
			wallet: true,
		},
		Link: {
			block: true,
			transaction: true,
			wallet: true,
		},
		Transaction: {
			transfer: true,
		},
		Derivation: {
			bip39: true,
			bip44: true,
		},
	},
	transactionTypes: ["transfer"],
};

export default network;
