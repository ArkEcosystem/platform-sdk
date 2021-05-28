import "jest-extended";

import { Exceptions } from "@arkecosystem/platform-sdk";

import { SignedTransactionData } from "./signed-transaction";

let subject: SignedTransactionData;

beforeEach(() => {
	subject = new SignedTransactionData(
		"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
		{
			timestamp: "1970-01-01T00:00:00.000Z",
		},
		"",
	);
});

describe("SignedTransactionData", () => {
	test("#timestamp", () => {
		expect(() => subject.timestamp()).toThrow(Exceptions.NotImplemented);
	});
});
