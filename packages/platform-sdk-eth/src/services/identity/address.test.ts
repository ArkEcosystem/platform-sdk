import "jest-extended";
import { AddressService } from "./address";
import { identity } from "../../../test/fixtures/identity";
import { createConfig } from "../../../test/helpers";

let subject: AddressService;

beforeEach(async () => (subject = new AddressService(createConfig())));

describe("Address", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toMatchInlineSnapshot(`
		Object {
		  "address": "0xFE8D8D622E31B21EF3ED035633C2B40E8FD9BBCA",
		  "type": "bip44",
		}
	`);
	});

	it("should generate an output from a multiSignature", async () => {
		await expect(
			subject.fromMultiSignature(identity.multiSignature.min, identity.multiSignature.publicKeys),
		).rejects.toThrow(/is not implemented/);
	});

	it("should generate an output from a publicKey", async () => {
		const result = await subject.fromPublicKey(identity.publicKey);

		expect(result).toMatchInlineSnapshot(`
		Object {
		  "address": "0xFE8D8D622E31B21EF3ED035633C2B40E8FD9BBCA",
		  "type": "bip44",
		}
	`);
	});

	it("should generate an output from a privateKey", async () => {
		const result = await subject.fromPrivateKey(identity.privateKey);

		expect(result).toMatchInlineSnapshot(`
		Object {
		  "address": "0xFE8D8D622E31B21EF3ED035633C2B40E8FD9BBCA",
		  "type": "bip44",
		}
	`);
	});

	it("should generate an output from a wif", async () => {
		await expect(subject.fromWIF(identity.wif)).rejects.toThrow(/is not implemented/);
	});
});
