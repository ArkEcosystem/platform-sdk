import "jest-extended";

import { TransactionService } from "../../src/services/transaction";

let subject: TransactionService;

beforeEach(() => (subject = new TransactionService("devnet")));

describe("TransactionService", () => {
	describe.skip("#createTransfer", () => {
		it("should verify", async () => {
			const result: any = await subject.createTransfer({
				amount: 1,
				recipientId: "cosmos1fvxjdyfdvat5g0ee7jmyemwl2n95ad7negf7ap",
				passphrase: "this is a top secret passphrase",
			});

			console.log(result);
		});
	});
});
