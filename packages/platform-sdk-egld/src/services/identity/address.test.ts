import "jest-extended";

import { identity } from "../../../test/fixtures/identity";
import { createConfig } from "../../../test/helpers";
import { IdentityService } from ".";

let subject: IdentityService;

beforeEach(async () => (subject = await IdentityService.__construct(createConfig())));

describe("Address", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.address().fromMnemonic(identity.mnemonic);

		expect(result).toBe(identity.address);
	});

	it("should fail to generate an output from a multiSignature", async () => {
		await expect(
			subject.address().fromMultiSignature(identity.multiSignature.min, identity.multiSignature.publicKeys),
		).rejects.toThrow(/is not supported/);
	});

	it("should fail to generate an output from a privateKey", async () => {
		const result = await subject.address().fromPrivateKey(identity.privateKey);

		expect(result).toBe(identity.address);
	});

	it("should generate an output from a publicKey", async () => {
		await expect(subject.address().fromPublicKey(identity.publicKey)).rejects.toThrow(/is not supported/);
	});

	it("should fail to generate an output from a wif", async () => {
		await expect(subject.address().fromWIF(identity.wif)).rejects.toThrow(/is not supported/);
	});

	it("should validate an address", async () => {
		await expect(subject.address().validate(identity.address)).resolves.toBeTrue();
		await expect(subject.address().validate(identity.address.slice(0, 10))).resolves.toBeFalse();
	});
});