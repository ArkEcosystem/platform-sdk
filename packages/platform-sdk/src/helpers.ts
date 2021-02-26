import { TransactionDataCollection } from "./coins";
import { MetaPagination, TransactionDataType } from "./contracts";

interface DataTransferObjects {
	TransactionData: any;
	BridgechainRegistrationData: any;
	BridgechainResignationData: any;
	BridgechainUpdateData: any;
	BusinessRegistrationData: any;
	BusinessResignationData: any;
	BusinessUpdateData: any;
	DelegateRegistrationData: any;
	DelegateResignationData: any;
	EntityRegistrationData: any;
	EntityResignationData: any;
	EntityUpdateData: any;
	HtlcClaimData: any;
	HtlcLockData: any;
	HtlcRefundData: any;
	IpfsData: any;
	MultiPaymentData: any;
	MultiSignatureData: any;
	SecondSignatureData: any;
	TransferData: any;
	VoteData: any;
}

export const createTransactionDataWithType = (transaction: unknown, dtos: DataTransferObjects): TransactionDataType => {
	const instance: TransactionDataType = new dtos.TransactionData(transaction);

	if (instance.isLegacyBridgechainRegistration()) {
		return new dtos.BridgechainRegistrationData(transaction);
	}

	if (instance.isLegacyBridgechainResignation()) {
		return new dtos.BridgechainResignationData(transaction);
	}

	if (instance.isLegacyBridgechainUpdate()) {
		return new dtos.BridgechainUpdateData(transaction);
	}

	if (instance.isLegacyBusinessRegistration()) {
		return new dtos.BusinessRegistrationData(transaction);
	}

	if (instance.isLegacyBusinessResignation()) {
		return new dtos.BusinessResignationData(transaction);
	}

	if (instance.isLegacyBusinessUpdate()) {
		return new dtos.BusinessUpdateData(transaction);
	}

	if (instance.isDelegateRegistration()) {
		return new dtos.DelegateRegistrationData(transaction);
	}

	if (instance.isDelegateResignation()) {
		return new dtos.DelegateResignationData(transaction);
	}

	if (instance.isEntityRegistration()) {
		return new dtos.EntityRegistrationData(transaction);
	}

	if (instance.isEntityResignation()) {
		return new dtos.EntityResignationData(transaction);
	}

	if (instance.isEntityUpdate()) {
		return new dtos.EntityUpdateData(transaction);
	}

	if (instance.isHtlcClaim()) {
		return new dtos.HtlcClaimData(transaction);
	}

	if (instance.isHtlcLock()) {
		return new dtos.HtlcLockData(transaction);
	}

	if (instance.isHtlcRefund()) {
		return new dtos.HtlcRefundData(transaction);
	}

	if (instance.isIpfs()) {
		return new dtos.IpfsData(transaction);
	}

	if (instance.isMultiPayment()) {
		return new dtos.MultiPaymentData(transaction);
	}

	if (instance.isMultiSignature()) {
		return new dtos.MultiSignatureData(transaction);
	}

	if (instance.isSecondSignature()) {
		return new dtos.SecondSignatureData(transaction);
	}

	if (instance.isTransfer()) {
		return new dtos.TransferData(transaction);
	}

	if (instance.isVote()) {
		return new dtos.VoteData(transaction);
	}

	if (instance.isUnvote()) {
		return new dtos.VoteData(transaction);
	}

	return instance;
};

export const createTransactionDataCollectionWithType = (
	transactions: unknown[],
	meta: MetaPagination,
	classes: DataTransferObjects,
): TransactionDataCollection =>
	new TransactionDataCollection(
		transactions.map((transaction) => createTransactionDataWithType(transaction, classes)),
		meta,
	);
