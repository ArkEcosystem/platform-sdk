import { identity } from "../../test/fixtures/identity";
import { createConfig } from "../../test/helpers";
import { SignedTransactionData } from "../dto";
import { TransactionService } from "./transaction";

let subject: TransactionService;

beforeEach(async () => {
	subject = await TransactionService.__construct(createConfig());
});

describe("Core", () => {
	describe("#transfer", () => {
		it.skip("should verify", async () => {
			const result = await subject.transfer({
				from: identity.address,
				sign: {
					mnemonic: identity.mnemonic,
				},
				data: {
					amount: "1",
					to: identity.address,
				},
			});

			expect(result).toBeInstanceOf(SignedTransactionData);
		});
	});
});
