import "jest-extended";

import { Signatories } from "@arkecosystem/platform-sdk";

import { identity } from "../../test/fixtures/identity";
import { createConfig } from "../../test/helpers";
import { MessageService } from "./message";

let subject: MessageService;

beforeEach(async () => (subject = await MessageService.__construct(createConfig())));

describe("MessageService", () => {
	it("should sign and verify a message", async () => {
		const result = await subject.sign({
			message: "Hello World",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: identity.publicKey,
					privateKey: identity.privateKey,
				}),
			),
		});

		expect(result).toMatchObject({
			message: "Hello World",
			signatory: "TAq9SwPACv2Ut6YGJK4T8Pw57AGNmFArdP",
			signature:
				"0x7fa9bb1d8a3d0008123a4d36d61a75fe8e297345e67dc3c2cd01f1bac10ed9201516625d2745e3065cb5c279028b2372376466370ff8f1e527f282c2e98a53c21b",
		});

		await expect(subject.verify(result)).resolves.toBeTrue();
	});
});
