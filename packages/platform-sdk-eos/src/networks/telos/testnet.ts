import { Coins } from "@arkecosystem/platform-sdk";

const network: Coins.CoinNetwork = {
	id: "telos.testnet",
	type: "test",
	name: "TELOS Testnet",
	explorer: "https://telos-test.bloks.io/",
	currency: {
		ticker: "TLOS",
		symbol: "TLOS",
	},
	crypto: {
		networkId: "e17615decaecd202a365f4c029f206eee98511979de8a5756317e2469f2289e3",
		slip44: 194,
		bech32: "TLOS",
		signingMethods: {
			privateKey: true,
		},
	},
	networking: {
		hosts: [
			"https://telos-testnet.eosblocksmith.io",
			"https://api.eos.miami",
			"https://testnet.telos.caleos.io",
			"https://api-test.telosfoundation.io",
		],
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
};

export default network;
