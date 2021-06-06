import "jest-extended";

import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

import { createService } from "../../test/helpers";
import { TransactionData } from "./transaction";

let subject: TransactionData;

beforeEach(() => {
	subject = createService(TransactionData);
	subject.configure({
		txid: "718bc4cfc50c361a8afe032e2c170dfebadce16ea72228a57634413b62b7cf24",
		time: 1588930966,
		block_height: 4259222,
		asset: "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
		amount: 1,
		address_to: "Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF",
		address_from: "AStJyBXGGBK6bwrRfRUHSjp993PB5C9QgF",
	});
});

describe("TransactionData", () => {
	it("should succeed", async () => {
		expect(subject).toBeInstanceOf(TransactionData);
		expect(subject.id()).toBe("718bc4cfc50c361a8afe032e2c170dfebadce16ea72228a57634413b62b7cf24");
		expect(subject.type()).toBe("transfer");
		expect(subject.timestamp()).toBeInstanceOf(DateTime);
		expect(subject.confirmations()).toEqual(BigNumber.ZERO);
		expect(subject.sender()).toBe("AStJyBXGGBK6bwrRfRUHSjp993PB5C9QgF");
		expect(subject.recipient()).toBe("Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF");
		expect(subject.amount()).toEqual(BigNumber.make(1));
		expect(subject.fee()).toEqual(BigNumber.ZERO);
		expect(subject.memo()).toBeUndefined();
	});
});
