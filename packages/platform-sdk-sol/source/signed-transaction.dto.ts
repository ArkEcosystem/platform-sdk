import { Contracts, DTO, IoC } from "@arkecosystem/platform-sdk";
import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

@IoC.injectable()
export class SignedTransactionData
	extends DTO.AbstractSignedTransactionData
	implements Contracts.SignedTransactionData {
	public sender(): string {
		return this.signedData.sender;
	}

	public recipient(): string {
		return this.signedData.recipient;
	}

	public amount(): BigNumber {
		return this.bigNumberService.make(this.signedData.amount);
	}

	public fee(): BigNumber {
		return this.bigNumberService.make(this.signedData.fee);
	}

	public timestamp(): DateTime {
		return DateTime.make(this.signedData.timestamp);
	}
}
