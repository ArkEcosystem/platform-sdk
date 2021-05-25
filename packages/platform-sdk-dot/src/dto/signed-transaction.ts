import { Contracts, DTO, Exceptions } from "@arkecosystem/platform-sdk";
import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

export class SignedTransactionData
	extends DTO.AbstractSignedTransactionData
	implements Contracts.SignedTransactionData {
	public sender(): string {
		return this.signedData.signature.signer;
	}

	public recipient(): string {
		return this.signedData.method.args.dest;
	}

	public amount(): BigNumber {
		return BigNumber.make(this.signedData.method.args.value);
	}

	public fee(): BigNumber {
		return BigNumber.ZERO;
	}

	public timestamp(): DateTime {
		throw new Exceptions.NotImplemented(this.constructor.name, this.timestamp.name);
	}

	public isMultiSignature(): boolean {
		return false;
	}

	public isMultiSignatureRegistration(): boolean {
		return false;
	}
}
