import "jest-extended";

import Fixture from "../../../test/fixtures/client/cryptoConfiguration.json";
import { DelegateRegistrationData } from "./delegate-registration";

let subject: DelegateRegistrationData;

beforeEach(() => (subject = new DelegateRegistrationData(Fixture.data.genesisBlock.transactions[1])));

describe("DelegateRegistrationData", () => {
	test("#id", () => {
		expect(subject.username()).toBe("genesis_1");
	});

	test("#type", () => {
		expect(subject.type()).toBe("delegateRegistration");
	});
});
