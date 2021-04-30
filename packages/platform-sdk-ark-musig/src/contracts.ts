import { Interfaces } from "@arkecosystem/crypto";

export interface IStoreTransaction {
	data: Interfaces.ITransactionData;
	multisigAsset: Interfaces.IMultiSignatureAsset;
	timestampReceived: number;
	timestamp?: number;
	id?: string;
}

export enum TransactionStatus {
	Ready = "ready",
	Pending = "pending",
}
