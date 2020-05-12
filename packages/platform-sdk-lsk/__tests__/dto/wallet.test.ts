import { Utils } from "@arkecosystem/platform-sdk";

import { WalletData } from "../../src/dto";
import Fixture from "../__fixtures__/client/wallet.json";

let subject: WalletData;

beforeEach(() => (subject = new WalletData(Fixture.data[0])));

describe("WalletData", function () {
	test("#address", () => {
		expect(subject.address()).toBe("6566229458323231555L");
	});

	test("#publicKey", () => {
		expect(subject.publicKey()).toBe("d121d3abf5425fdc0f161d9ddb32f89b7750b4bdb0bff7d18b191d4b4bafa6d4");
	});

	test("#balance", () => {
		expect(subject.balance()).toEqual(Utils.BigNumber.make("-9999333679754263"));
	});
});
