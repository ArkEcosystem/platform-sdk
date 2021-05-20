import { Coins } from "@arkecosystem/platform-sdk";

const network: Coins.NetworkManifest = {
	id: "dot.mainnet",
	type: "live",
	name: "Mainnet",
	coin: "Polkadot",
	explorer: "https://polkascan.io/polkadot",
	currency: {
		ticker: "DOT",
		symbol: "DOT",
	},
	fees: {
		type: "weight",
		ticker: "DOT",
	},
	crypto: {
		networkId: "0",
		expirationType: "height",
	},
	networking: {
		hosts: ["https://rpc.polkadot.io/"],
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
				multiSignature: true,
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
		Ledger: {
			getVersion: true,
			getPublicKey: true,
			signTransaction: true,
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
    importMethods: [
        "bip38",
        "bip39",
        "bip44",
        "bip49",
        "bip84",
        "privateKey",
        "secret",
        "wif",
    ],
};

export default network;
