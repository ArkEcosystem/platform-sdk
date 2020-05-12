import "jest-extended";

import { BigNumber } from "@arkecosystem/utils";

import { WalletData } from "../../src/dto/wallet";
import fixtures from "../services/fixtures/responses";

describe("WalletData", function () {
	it("should succeed", async () => {
		const result = new WalletData({
			account: "rMWnHRpSWTYSsxbDjASvGvC31F4pRkyYHP",
			balance: fixtures.getAccountInfo.xrpBalance,
		});

		expect(result).toBeInstanceOf(WalletData);
		expect(result.address()).toEqual("rMWnHRpSWTYSsxbDjASvGvC31F4pRkyYHP");
		// expect(result.publicKey()).toBeUndefined();
		expect(result.balance()).toEqual(BigNumber.make("92291324300"));
	});
});
