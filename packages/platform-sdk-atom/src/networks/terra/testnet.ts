import { Coins } from "@arkecosystem/platform-sdk";

const network: Coins.CoinNetwork = {
	id: "terra.testnet",
	type: "test",
	name: "Terra Testnet",
	explorer: "https://soju.stake.id/",
	currency: {
		ticker: "LUNA",
		symbol: "LUNA",
	},
	crypto: {
		networkId: "soju-0014",
		slip44: 330,
		bech32: "terra",
		signingMethods: {
			mnemonic: true,
		},
	},
	networking: {
		hosts: [],
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
