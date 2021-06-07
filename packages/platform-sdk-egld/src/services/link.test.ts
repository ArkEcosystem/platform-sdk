import "jest-extended";

import { Services } from "@arkecosystem/platform-sdk";
import { createService } from "../../test/helpers";

let subject: Services.AbstractLinkService;

beforeAll(async () => {
	subject = createService(Services.AbstractLinkService);
});

it("should generate a link for a block", async () => {
	expect(subject.block("id")).toMatchInlineSnapshot(`"https://testnet-explorer.elrond.com/miniblocks/id"`);
});

it("should generate a link for a transaction", async () => {
	expect(subject.transaction("id")).toMatchInlineSnapshot(`"https://testnet-explorer.elrond.com/transactions/id"`);
});

it("should generate a link for a wallet", async () => {
	expect(subject.wallet("id")).toMatchInlineSnapshot(`"https://testnet-explorer.elrond.com/accounts/id"`);
});
