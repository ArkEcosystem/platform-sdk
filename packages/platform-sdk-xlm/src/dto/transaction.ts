import { Contracts, DTO, Exceptions } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

export class TransactionData extends DTO.AbstractTransactionData implements Contracts.TransactionData {
	public id(): string {
		return this.data.transaction_hash || this.data.id;
	}

	public type(): string {
		return "transfer";
	}

	public timestamp(): number | undefined {
		return +new Date(this.data.created_at);
	}

	public confirmations(): BigNumber {
		throw new Exceptions.NotImplemented(this.constructor.name, "confirmations");
	}

	public sender(): string {
		return this.data.from || this.data.operation.from;
	}

	public recipient(): string {
		return this.data.to || this.data.operation.to;
	}

	public recipients(): Contracts.MultiPaymentRecipient[] {
		throw new Exceptions.NotImplemented(this.constructor.name, "recipients");
	}

	public amount(): BigNumber {
		return BigNumber.make((this.data.amount || this.data.operation.amount) * 1e8);
	}

	// todo: with the "transaction" method we get a nonce but with "transactions" it isn't available
	public fee(): BigNumber {
		return BigNumber.make((this.data.fee_charged || 0) * 1e8);
	}

	public memo(): string | undefined {
		return undefined;
	}

	public asset(): Record<string, unknown> {
		return {};
	}

	public isConfirmed(): boolean {
		return false;
	}

	public isSent(): boolean {
		return false;
	}

	public isReceived(): boolean {
		return false;
	}

	public isTransfer(): boolean {
		return false;
	}

	public isSecondSignature(): boolean {
		return false;
	}

	public isDelegateRegistration(): boolean {
		return false;
	}

	public isVote(): boolean {
		return false;
	}

	public isUnvote(): boolean {
		return false;
	}

	public isMultiSignature(): boolean {
		return false;
	}

	public isIpfs(): boolean {
		return false;
	}

	public isMultiPayment(): boolean {
		return false;
	}

	public isDelegateResignation(): boolean {
		return false;
	}

	public isHtlcLock(): boolean {
		return false;
	}

	public isHtlcClaim(): boolean {
		return false;
	}

	public isHtlcRefund(): boolean {
		return false;
	}

	public isBusinessRegistration(): boolean {
		return false;
	}

	public isBusinessResignation(): boolean {
		return false;
	}

	public isBusinessUpdate(): boolean {
		return false;
	}

	public isBridgechainRegistration(): boolean {
		return false;
	}

	public isBridgechainResignation(): boolean {
		return false;
	}

	public isBridgechainUpdate(): boolean {
		return false;
	}

	public isEntityRegistration(): boolean {
		return false;
	}

	public isEntityResignation(): boolean {
		return false;
	}

	public isEntityUpdate(): boolean {
		return false;
	}
}
