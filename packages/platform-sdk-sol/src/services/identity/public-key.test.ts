import "jest-extended";

import { identity } from "../../../test/fixtures/identity";
import { createConfig } from "../../../test/helpers";
import { IdentityService } from ".";

let subject: IdentityService;

beforeEach(async () => (subject = await IdentityService.__construct(createConfig())));

describe("#publicKey", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.publicKey().fromMnemonic(identity.mnemonic);

		expect(result).toBe(identity.publicKey);
	});

	it("should fail to generate an output from an invalid mnemonic", async () => {
		await expect(subject.publicKey().fromMnemonic(identity.mnemonic.slice(0, 10))).rejects.toThrowError();
	});

	it("should fail to generate an output from a multiSignature", async () => {
		await expect(
			subject.publicKey().fromMultiSignature(identity.multiSignature.min, identity.multiSignature.publicKeys),
		).rejects.toThrow(/is not supported/);
	});

	it("should fail to generate an output from a wif", async () => {
		await expect(subject.publicKey().fromWIF(identity.wif)).rejects.toThrow(/is not supported/);
	});
});
