import "jest-extended";

import { Coins } from "@arkecosystem/platform-sdk";
import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import Joi from "joi";

import { SignedTransactionData } from "./signed-transaction";
import { container } from "../container";
import { IoC, Services } from "@arkecosystem/platform-sdk";

let subject: SignedTransactionData;

beforeAll(() => {
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

	container.constant(IoC.ServiceKeys.BigNumberService, new Services.BigNumberService(
		new Coins.Config({
			network: {
				currency: {
					decimals: 1e8,
				}
			}
		}, Joi.object({
			network: Joi.object({
				currency: Joi.object({
					decimals: Joi.number(),
				})
			})
		}))
	));
});

describe("SignedTransactionData", () => {
	test("#id", () => {
		expect(subject.id()).toBe("3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572");
	});

	test("#sender", () => {
		expect(subject.sender()).toBe("DLK7ts2DpkbeBjFamuFtHLoDAq5upDhCmf");
	});

	test("#recipient", () => {
		expect(subject.recipient()).toBe("D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
	});

	test("#amount", () => {
		expect(subject.amount()).toEqual(BigNumber.make("12500000000000000"));
	});

	test("#fee", () => {
		expect(subject.fee()).toEqual(BigNumber.ZERO);
	});

	test("#timestamp", () => {
		expect(DateTime.make(0).isSame(subject.timestamp())).toBeTrue();
	});

	test("#timestamp missing", () => {
		const subject = new SignedTransactionData("", {}, "");
		expect(subject.timestamp()).toBeInstanceOf(DateTime);
	});
});
