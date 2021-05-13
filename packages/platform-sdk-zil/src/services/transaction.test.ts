import "jest-extended";

import { createConfig } from "../../test/config";
import { identity } from "../../test/fixtures/identity";
import { SignedTransactionData } from "../dto/signed-transaction";
import { TransactionService } from "./transaction";

let subject: TransactionService;

beforeEach(async () => {
	subject = await TransactionService.__construct(createConfig());
});

describe("TransactionService", () => {
	describe("#transfer", () => {
		it("should sign transaction", async () => {
			const result = await subject.transfer({
				from: identity.bech32Address,
				sign: {
					mnemonic: identity.mnemonic,
				},
				data: {
					amount: "420.69",
					to: identity.bech32Address,
				},
				fee: "2000",
				feeLimit: "50",
				nonce: "1",
			});

			expect(result).toBeInstanceOf(SignedTransactionData);
			expect(typeof result.toBroadcast()).toBe("string");
		});
	});
});
