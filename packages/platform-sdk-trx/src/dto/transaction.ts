import { Contracts, DTO, Exceptions } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/utils";

export class TransactionData extends DTO.AbstractTransactionData implements Contracts.TransactionData {
	public getId(): string {
		throw new Exceptions.NotImplemented(this.constructor.name, "getId");
	}

	public getType(): number | undefined {
		throw new Exceptions.NotImplemented(this.constructor.name, "getType");
	}

	public getTypeGroup(): number | undefined {
		throw new Exceptions.NotImplemented(this.constructor.name, "getTypeGroup");
	}

	public getTimestamp(): number | undefined {
		throw new Exceptions.NotImplemented(this.constructor.name, "getTimestamp");
	}

	public getConfirmations(): BigNumber {
		throw new Exceptions.NotImplemented(this.constructor.name, "getConfirmations");
	}

	public getNonce(): string {
		throw new Exceptions.NotImplemented(this.constructor.name, "getNonce");
	}

	public getSender(): string {
		throw new Exceptions.NotImplemented(this.constructor.name, "getSender");
	}

	public getRecipient(): string {
		throw new Exceptions.NotImplemented(this.constructor.name, "getRecipient");
	}

	public getAmount(): BigNumber {
		throw new Exceptions.NotImplemented(this.constructor.name, "getAmount");
	}

	public getFee(): BigNumber {
		throw new Exceptions.NotImplemented(this.constructor.name, "getFee");
	}

	public getVendorField(): string | undefined {
		throw new Exceptions.NotImplemented(this.constructor.name, "getVendorField");
	}

	public getBlockId(): string {
		throw new Exceptions.NotImplemented(this.constructor.name, "getBlockId");
	}
}
