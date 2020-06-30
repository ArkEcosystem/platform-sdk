import "jest-extended";

import { FeeService } from "./fee";
import { createConfig } from "../../test/helpers";

let subject: FeeService;

beforeEach(async () => (subject = await FeeService.construct(createConfig())));

describe("FeeService", function () {
	describe("#all", () => {
		it("should succeed", async () => {
			const result = await subject.all(7);

			expect(result).toContainAllKeys([
				"transfer",
				"secondSignature",
				"delegateRegistration",
				"vote",
				"multiSignature",
				"ipfs",
				"multiPayment",
				"delegateResignation",
				"htlcLock",
				"htlcClaim",
				"htlcRefund",
				"businessRegistration",
				"businessResignation",
				"businessUpdate",
				"bridgechainRegistration",
				"bridgechainResignation",
				"bridgechainUpdate",
			]);

			expect(result.transfer).toEqual({ avg: "10000000", max: "10000000", min: "10000000", static: "10000000" });
		});
	});
});
