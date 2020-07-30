import { Contracts, Exceptions } from "@arkecosystem/platform-sdk";

import { TransactionData } from "../transaction";

export class MultiPaymentData extends TransactionData implements Contracts.MultiPaymentData {
	public payments(): { recipientId: string; amount: string }[] {
		throw new Exceptions.NotSupported(this.constructor.name, "payments");
	}
}
