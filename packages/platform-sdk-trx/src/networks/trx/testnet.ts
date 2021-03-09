import { Coins } from "@arkecosystem/platform-sdk";

const network: Coins.CoinNetwork = {
	id: "trx.testnet",
	type: "test",
	name: "Testnet",
	explorer: "https://shasta.tronscan.org/#/",
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
	},
	networking: {
		hosts: ["https://api.shasta.trongrid.io"],
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
