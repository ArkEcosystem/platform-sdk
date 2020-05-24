import { Contracts, DTO } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import BN from "bignumber.js";

export class TransactionData extends DTO.AbstractTransactionData implements Contracts.TransactionData {
	public id(): string {
		return this.data.id;
	}

	public type(): string {
		return "transfer";
	}

	public timestamp(): number | undefined {
		if (!this.data.outcome.timestamp) {
			return undefined;
		}

		return +new Date(this.data.outcome.timestamp);
	}

	public confirmations(): BigNumber {
		return BigNumber.ZERO;
	}

	public sender(): string {
		return this.data.specification.source.address;
	}

	public recipient(): string {
		return this.data.specification.destination.address;
	}

	public amount(): BigNumber {
		const satoshi: string = new BN(this.data.outcome.deliveredAmount.value).times(1e8).toFixed();

		return BigNumber.make(satoshi);
	}

	public fee(): BigNumber {
		const satoshi: string = new BN(this.data.outcome.fee).times(1e8).toFixed();

		return BigNumber.make(satoshi);
	}

	public memo(): string | undefined {
		return undefined;
	}

	public asset(): object | undefined {
		return {};
	}
}
