import "jest-extended";

import { identity } from "../../../test/fixtures/identity";
import { createConfig } from "../../../test/helpers";
import { PrivateKey } from "./private-key";

let subject: PrivateKey;

beforeEach(async () => (subject = new PrivateKey(createConfig())));

describe("PrivateKey", () => {
	it("should generate an output from a mnemonic", async () => {
		const result: any = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toBe(identity.privateKey);
	});

	it("should generate an output from a wif", async () => {
		await expect(subject.fromWIF(identity.wif)).rejects.toThrow(/is not supported/);
	});
});
