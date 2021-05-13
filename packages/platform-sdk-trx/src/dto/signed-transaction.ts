import { Contracts, DTO, Exceptions } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

export class SignedTransactionData
	extends DTO.AbstractSignedTransactionData
	implements Contracts.SignedTransactionData {
	public sender(): string {
		return this.data.raw_data.contract[0].parameter.value.owner_address;
	}

	public recipient(): string {
		return this.data.raw_data.contract[0].parameter.value.to_address;
	}

	public amount(): BigNumber {
		return BigNumber.make(this.data.raw_data.contract[0].parameter.value.amount);
	}

	public fee(): BigNumber {
		return BigNumber.ZERO;
	}

	public isMultiSignature(): boolean {
		return false;
	}

	public isMultiSignatureRegistration(): boolean {
		throw false;
	}
}
