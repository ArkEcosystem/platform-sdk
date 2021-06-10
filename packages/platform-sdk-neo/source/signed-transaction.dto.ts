import { Contracts, DTO, Exceptions, IoC } from "@arkecosystem/platform-sdk";
import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

@IoC.injectable()
export class SignedTransactionData
	extends DTO.AbstractSignedTransactionData
	implements Contracts.SignedTransactionData {
	public sender(): string {
		throw new Exceptions.NotImplemented(this.constructor.name, this.sender.name);
	}

	public recipient(): string {
		throw new Exceptions.NotImplemented(this.constructor.name, this.recipient.name);
	}

	public amount(): BigNumber {
		throw new Exceptions.NotImplemented(this.constructor.name, this.amount.name);
	}

	public fee(): BigNumber {
		throw new Exceptions.NotImplemented(this.constructor.name, this.fee.name);
	}

	public timestamp(): DateTime {
		return DateTime.make(this.signedData.timestamp);
	}

	public isMultiSignature(): boolean {
		return false;
	}

	public isMultiSignatureRegistration(): boolean {
		throw new Exceptions.NotImplemented(this.constructor.name, this.isMultiSignatureRegistration.name);
	}
}