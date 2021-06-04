import "jest-extended";

import { DateTime } from "@arkecosystem/platform-sdk-intl";

import { SignedTransactionData } from "./signed-transaction";
import { Test } from "@arkecosystem/platform-sdk";
import { container } from "../container";

let subject: SignedTransactionData;

beforeEach(() => {
	subject = new SignedTransactionData(
		"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
		{
			id: "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
			amount: "12500000000000000",
			fee: "0",
			timestamp: "1970-01-01T00:00:00.000Z",
			senderPublicKey: "0208e6835a8f020cfad439c059b89addc1ce21f8cab0af6e6957e22d3720bff8a4",
			recipientId: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
		},
		"",
	);

	Test.bindBigNumberService(container);
});

describe("SignedTransactionData", () => {
	test("#timestamp", () => {
		expect(DateTime.make(0).isSame(subject.timestamp())).toBeTrue();
	});
});
