import { Coins } from "@arkecosystem/platform-sdk";

const network: Coins.CoinNetwork = {
	id: "xlm.mainnet",
	type: "live",
	name: "Mainnet",
	explorer: "https://steexp.com/",
	currency: {
		ticker: "XLM",
		symbol: "XLM",
	},
	crypto: {
		slip44: 148,
		signingMethods: {
			mnemonic: true,
		},
	},
	networking: {
		hosts: ["https://horizon.stellar.org"],
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
			transactions: true,
			wallet: true,
			broadcast: true,
		},
		Identity: {
			address: {
				mnemonic: true,
			},
			publicKey: {
				mnemonic: true,
			},
			privateKey: {
				mnemonic: true,
			},
			keyPair: {
				mnemonic: true,
				privateKey: true,
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
			transfer: true,
		},
	},
	transactionTypes: ["transfer"],
};

export default network;
