export interface TransactionFee {
	static: string;
	max: string;
	min: string;
	avg: string;
}

export interface TransactionFees {
	// Core
	transfer: TransactionFee;
	secondSignature: TransactionFee;
	delegateRegistration: TransactionFee;
	vote: TransactionFee;
	multiSignature: TransactionFee;
	ipfs: TransactionFee;
	multiPayment: TransactionFee;
	delegateResignation: TransactionFee;
	htlcLock: TransactionFee;
	htlcClaim: TransactionFee;
	htlcRefund: TransactionFee;
	// Magistrate
	businessRegistration: TransactionFee;
	businessResignation: TransactionFee;
	businessUpdate: TransactionFee;
	bridgechainRegistration: TransactionFee;
	bridgechainResignation: TransactionFee;
	bridgechainUpdate: TransactionFee;
}

export interface FeeService {
	destruct(): Promise<void>;

	all(days: number): Promise<TransactionFees>;
}
