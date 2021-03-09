import { Coins } from "@arkecosystem/platform-sdk";

const network: Coins.CoinNetwork = {
	id: "cosmos.mainnet",
	type: "live",
	name: "Cosmos Mainnet",
	explorer: "https://stake.id/",
	currency: {
		ticker: "ATOM",
		symbol: "ATOM",
	},
	crypto: {
		networkId: "cosmoshub-3",
		slip44: 118,
		bech32: "cosmos",
		signingMethods: {
			mnemonic: true,
		},
	},
	networking: {
		hosts: ["https://api.cosmos.network"],
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
			syncing: true,
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
		Derivation: {
			bip39: true,
			bip44: true,
		},
	},
	transactionTypes: ["transfer"],
};

export default network;
