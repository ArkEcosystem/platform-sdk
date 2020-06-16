// Some return objects, strings and objects so we want to avoid annoying type issues.
export type SignedTransaction = any;

export interface TransactionService {
	destruct(): Promise<void>;

	// Core
	transfer(input: TransferInput, options?: TransactionOptions): Promise<SignedTransaction>;
	secondSignature(input: SecondSignatureInput, options?: TransactionOptions): Promise<SignedTransaction>;
	delegateRegistration(input: DelegateRegistrationInput, options?: TransactionOptions): Promise<SignedTransaction>;
	vote(input: VoteInput, options?: TransactionOptions): Promise<SignedTransaction>;
	multiSignature(input: MultiSignatureInput, options?: TransactionOptions): Promise<SignedTransaction>;
	ipfs(input: IpfsInput, options?: TransactionOptions): Promise<SignedTransaction>;
	multiPayment(input: MultiPaymentInput, options?: TransactionOptions): Promise<SignedTransaction>;
	delegateResignation(input: DelegateResignationInput, options?: TransactionOptions): Promise<SignedTransaction>;
	htlcLock(input: HtlcLockInput, options?: TransactionOptions): Promise<SignedTransaction>;
	htlcClaim(input: HtlcClaimInput, options?: TransactionOptions): Promise<SignedTransaction>;
	htlcRefund(input: HtlcRefundInput, options?: TransactionOptions): Promise<SignedTransaction>;

	// Magistrate
	businessRegistration(input: BusinessRegistrationInput, options?: TransactionOptions): Promise<SignedTransaction>;
	businessResignation(input: BusinessResignationInput, options?: TransactionOptions): Promise<SignedTransaction>;
	businessUpdate(input: BusinessUpdateInput, options?: TransactionOptions): Promise<SignedTransaction>;
	bridgechainRegistration(
		input: BridgechainRegistrationInput,
		options?: TransactionOptions,
	): Promise<SignedTransaction>;
	bridgechainResignation(
		input: BridgechainResignationInput,
		options?: TransactionOptions,
	): Promise<SignedTransaction>;
	bridgechainUpdate(input: BridgechainUpdateInput, options?: TransactionOptions): Promise<SignedTransaction>;
}

// Transaction Signing
interface TransactionInput {
	fee?: string;
	feeLimit?: string;
	nonce?: string;
	sign: {
		mnemonic: string;
		mnemonics?: string[];
		secondMnemonic?: string;
		wif?: string;
		secondWif?: string;
		privateKey?: string;
	};
	contract?: {
		address: string;
	};
}

export interface TransactionOptions {
	unsignedJson: boolean;
	unsignedBytes: boolean;
}

export interface TransferInput extends TransactionInput {
	data: {
		amount: string;
		from?: string;
		to: string;
		memo?: string;
	};
}

export interface SecondSignatureInput extends TransactionInput {
	data: { mnemonic: string };
}

export interface DelegateRegistrationInput extends TransactionInput {
	data: { username: string };
}

export interface VoteInput extends TransactionInput {
	data: { vote: string };
}

export interface MultiSignatureInput extends TransactionInput {
	data: {
		publicKeys: string[];
		lifetime?: number;
		min: number;
		senderPublicKey?: string;
	};
}

export interface IpfsInput extends TransactionInput {
	data: { hash: string };
}

export interface MultiPaymentInput extends TransactionInput {
	data: {
		payments: { to: string; amount: string }[];
	};
}

export type DelegateResignationInput = TransactionInput;

export interface HtlcLockInput extends TransactionInput {
	data: {
		amount: string;
		to: string;
		secretHash: string;
		expiration: {
			type: number;
			value: number;
		};
	};
}

export interface HtlcClaimInput extends TransactionInput {
	data: {
		lockTransactionId: string;
		unlockSecret: string;
	};
}

export interface HtlcRefundInput extends TransactionInput {
	data: { lockTransactionId: string };
}

// TODO: get rid of this once AIP36 is implemented
export interface BusinessRegistrationInput extends TransactionInput {
	data: {
		name: string;
		website: string;
		vat?: string;
		repository?: string;
	};
}

export interface BusinessResignationInput extends TransactionInput {
	data: {};
}

export interface BusinessUpdateInput extends TransactionInput {
	data: {
		name?: string;
		website?: string;
		vat?: string;
		repository?: string;
	};
}

export interface BridgechainRegistrationInput extends TransactionInput {
	data: {
		name: string;
		seedNodes: string[];
		genesisHash: string;
		bridgechainRepository: string;
		bridgechainAssetRepository?: string;
		ports: {
			[name: string]: number;
		};
	};
}

export interface BridgechainResignationInput extends TransactionInput {
	data: {
		bridgechainId: string;
	};
}

export interface BridgechainUpdateInput extends TransactionInput {
	data: {
		bridgechainId: string;
		seedNodes?: string[];
		ports?: {
			[name: string]: number;
		};
		bridgechainRepository?: string;
		bridgechainAssetRepository?: string;
	};
}
