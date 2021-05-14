import "jest-extended";

import { identity } from "../../../test/fixtures/identity";
import { createConfig } from "../../../test/helpers";
import { IdentityService } from ".";

let subject: IdentityService;

beforeEach(async () => (subject = await IdentityService.__construct(createConfig())));

describe("#keys", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.keys().fromMnemonic(identity.mnemonic);

		expect(result).toEqual({
			privateKey: identity.privateKey,
			publicKey: identity.publicKey,
		});
	});

	it("should generate an output from a private key", async () => {
		const result = await subject.keys().fromPrivateKey(identity.privateKey);

		expect(result).toEqual({
			privateKey: identity.privateKey,
			publicKey: identity.publicKey,
		});
	});
});