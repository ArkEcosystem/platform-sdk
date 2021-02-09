import { Coins } from "@arkecosystem/platform-sdk";

const network: Coins.CoinNetwork = {
	id: "trx.mainnet",
	type: "live",
	name: "Mainnet",
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
			wif: false,
		},
	},
	networking: {
		hosts: ["https://api.trongrid.io"],
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
	},
};

export default network;
