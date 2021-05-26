import "jest-extended";

import { identity } from "../../../test/fixtures/identity";
import { createConfigWithNetwork } from "../../../test/helpers";
import { WIFService } from "./wif";
import { IdentityService } from ".";

let subject: WIFService;

beforeEach(async () => (subject = (await IdentityService.__construct(createConfigWithNetwork())).wif()));

describe("WIF", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toEqual({ wif: "SGq4xLgZKCGxs7bjmwnBrWcT4C1ADFEermj846KC97FSv1WFD1dA" });
	});
});
