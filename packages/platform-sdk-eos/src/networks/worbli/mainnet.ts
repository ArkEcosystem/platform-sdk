import { Coins } from "@arkecosystem/platform-sdk";

const network: Coins.CoinNetwork = {
	id: "worbli.mainnet",
	type: "live",
	name: "WORBLI Mainnet",
	explorer: "https://worbli.bloks.io/",
	currency: {
		ticker: "WBI",
		symbol: "WBI",
	},
	crypto: {
		networkId: "73647cde120091e0a4b85bced2f3cfdb3041e266cbbe95cee59b73235a1b3b6f",
		slip44: 194,
		bech32: "WBI",
		signingMethods: {
			privateKey: true,
		},
	},
	networking: {
		hosts: ["https://api.worbli.io", "https://worbli-mainnet.eosblocksmith.io"],
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
			wallet: true,
			broadcast: true,
		},
		Identity: {
			publicKey: {
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
	},
	transactionTypes: ["transfer"],
};

export default network;
