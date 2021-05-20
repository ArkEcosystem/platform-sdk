import { KeyValuePair } from "../contracts";

export type FeeType = "static" | "dynamic" | "gas" | "free" | "weight";

export type CoinTransactionTypes =
	| "delegate-registration"
	| "delegate-resignation"
	| "htlc-claim"
	| "htlc-lock"
	| "htlc-refund"
	| "ipfs"
	| "multi-payment"
	| "multi-signature"
	| "second-signature"
	| "transfer"
	| "vote";

export type ExpirationType = "height" | "timestamp";

export type DerivationMethod = Partial<[
	"bip39",
	"bip44",
	"bip49",
	"bip84",
]>;

export type ImportMethod = DerivationMethod & Partial<[
	"bip38",
	"privateKey",
	"secret",
	"wif",
]>;

export interface NetworkFeatureFlags {
	Client?: {
		transaction?: boolean;
		transactions?: boolean;
		wallet?: boolean;
		wallets?: boolean;
		delegate?: boolean;
		delegates?: boolean;
		votes?: boolean;
		voters?: boolean;
		configuration?: boolean;
		fees?: boolean;
		syncing?: boolean;
		broadcast?: boolean;
	};
	Fee?: {
		all?: boolean;
	};
	Identity?: {
		address?: {
			mnemonic?: DerivationMethodBehaviour;
			multiSignature?: DerivationMethodBehaviour;
			publicKey?: DerivationMethodBehaviour;
			privateKey?: DerivationMethodBehaviour;
			wif?: DerivationMethodBehaviour;
			secret?: DerivationMethodBehaviour;
			validate?: boolean;
		};
		publicKey?: {
			mnemonic?: DerivationMethodBehaviour;
			multiSignature?: DerivationMethodBehaviour;
			wif?: DerivationMethodBehaviour;
			secret?: boolean;
		};
		privateKey?: {
			mnemonic?: DerivationMethodBehaviour;
			wif?: DerivationMethodBehaviour;
			secret?: boolean;
		};
		wif?: {
			mnemonic?: DerivationMethodBehaviour;
			secret?: boolean;
		};
		keyPair?: {
			mnemonic?: DerivationMethodBehaviour;
			privateKey?: DerivationMethodBehaviour;
			wif?: DerivationMethodBehaviour;
			secret?: boolean;
		};
	};
	Ledger?: {
		getVersion?: boolean;
		getPublicKey?: boolean;
		signTransaction?: boolean;
		signMessage?: boolean;
	};
	Link?: {
		block?: boolean;
		transaction?: boolean;
		wallet?: boolean;
	};
	Message?: {
		sign?: boolean;
		verify?: boolean;
	};
	Peer?: {
		search?: boolean;
	};
	Transaction?: {
		transfer?: boolean;
		transferWithLedgerS?: boolean;
		transferWithLedgerX?: boolean;
		secondSignature?: boolean;
		secondSignatureWithLedgerS?: boolean;
		secondSignatureWithLedgerX?: boolean;
		delegateRegistration?: boolean;
		delegateRegistrationWithLedgerS?: boolean;
		delegateRegistrationWithLedgerX?: boolean;
		vote?: boolean;
		voteWithLedgerS?: boolean;
		voteWithLedgerX?: boolean;
		multiSignature?: boolean;
		multiSignatureWithLedgerS?: boolean;
		multiSignatureWithLedgerX?: boolean;
		ipfs?: boolean;
		ipfsWithLedgerS?: boolean;
		ipfsWithLedgerX?: boolean;
		multiPayment?: boolean;
		multiPaymentWithLedgerS?: boolean;
		multiPaymentWithLedgerX?: boolean;
		delegateResignation?: boolean;
		delegateResignationWithLedgerS?: boolean;
		delegateResignationWithLedgerX?: boolean;
		htlcLock?: boolean;
		htlcLockWithLedgerS?: boolean;
		htlcLockWithLedgerX?: boolean;
		htlcClaim?: boolean;
		htlcClaimWithLedgerS?: boolean;
		htlcClaimWithLedgerX?: boolean;
		htlcRefund?: boolean;
		htlcRefundWithLedgerS?: boolean;
		htlcRefundWithLedgerX?: boolean;
	};
	Miscellaneous?: {
		dynamicFees?: boolean;
		memo?: boolean;
		utxo?: boolean;
	};
	Derivation?: DerivationMethods;
	Internal?: {
		fastDelegateSync?: boolean;
	};
}

export interface NetworkManifest {
	id: string;
	type: string;
	name: string;
	coin: string;
	explorer: string;
	currency: {
		ticker: string;
		symbol: string;
	};
	fees: {
		type: FeeType;
		ticker: string;
	};
	crypto: {
		networkId?: string;
		blockchainId?: string;
		assetId?: string;
		slip44?: number;
		bech32?: string;
		signingMethods?: {
			mnemonic?: boolean;
			privateKey?: boolean;
			wif?: boolean;
		};
		derivation?: {
			extendedPublicKey: boolean;
		};
		expirationType: ExpirationType;
	};
	networking: {
		hosts: string[];
		hostsMultiSignature?: string[];
		hostsArchival?: string[];
	};
	governance?: {
		voting?: {
			enabled: boolean;
			delegateCount: number;
			maximumPerWallet: number;
			maximumPerTransaction: number;
		};
	};
	featureFlags: NetworkFeatureFlags;
	// @TODO: we could replace this with kebabCase(Object.keys(FeatureFlags.Transaction))
	transactionTypes: CoinTransactionTypes[];
	importMethods: ImportMethod;
	knownWallets?: string;
	meta?: KeyValuePair;
}

export interface CoinManifest {
	name: string;
	networks: Record<string, NetworkManifest>;
}
