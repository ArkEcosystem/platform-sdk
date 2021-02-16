import { Coins } from "@arkecosystem/platform-sdk";

const network: Coins.CoinNetwork = {
	id: "eth.kovan",
	type: "test",
	name: "Kovan",
	explorer: "https://kovan.etherscan.io/",
	currency: {
		ticker: "ETH",
		symbol: "Ξ",
	},
	crypto: {
		networkId: "2",
		slip44: 60,
		signingMethods: {
			mnemonic: true,
			privateKey: true,
		},
	},
	networking: {
		hosts: ["https://coins.com/api/eth"],
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
		Identity: {
			address: {
				publicKey: true,
				privateKey: true,
			},
			keyPair: {
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
