export const manifest = {
	name: "Bitcoin",
	ticker: "BTC",
	networks: {
		live: {
			ticker: "BTC",
			explorer: "https://blockstream.info/",
		},
		test: {
			ticker: "BTC",
			explorer: "https://blockstream.info/testnet/",
		},
	},
	behaviours: {
		Client: {
			transaction: false,
			transactions: false,
			wallet: false,
			wallets: false,
			delegate: false,
			delegates: false,
			votes: false,
			voters: false,
			configuration: false,
			fees: false,
			syncing: false,
			broadcast: false,
		},
		Fee: {
			all: false,
		},
		Identity: {
			address: {
				passphrase: false,
				multiSignature: false,
				publicKey: false,
				privateKey: false,
				wif: false,
			},
			publicKey: {
				passphrase: false,
				multiSignature: false,
				wif: false,
			},
			privateKey: {
				passphrase: false,
				wif: false,
			},
			wif: {
				passphrase: false,
			},
			keyPair: {
				passphrase: false,
				publicKey: false,
				privateKey: false,
				wif: false,
			},
		},
		Ledger: {
			getVersion: false,
			getPublicKey: false,
			signTransaction: false,
			signMessage: false,
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
		Peer: {
			search: false,
			searchWithPlugin: false,
			searchWithoutEstimates: false,
		},
		Transaction: {
			transfer: false,
			secondSignature: false,
			delegateRegistration: false,
			vote: false,
			multiSignature: false,
			ipfs: false,
			multiPayment: false,
			delegateResignation: false,
			htlcLock: false,
			htlcClaim: false,
			htlcRefund: false,
		},
	},
};
