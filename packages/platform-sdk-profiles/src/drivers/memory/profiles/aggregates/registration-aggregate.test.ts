import "jest-extended";

import nock from "nock";

import { identity } from "../../../../../test/fixtures/identity";
import { bootContainer } from "../../../../../test/helpers";
import { Profile } from "../profile";
import { RegistrationAggregate } from "./registration-aggregate";

let subject: RegistrationAggregate;
let profile: Profile;

beforeAll(() => {
	bootContainer();

	nock(/.+/)
		.get("/api/node/configuration/crypto")
		.reply(200, require("../../../../../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/peers")
		.reply(200, require("../../../../../test/fixtures/client/peers.json"))
		.get("/api/node/syncing")
		.reply(200, require("../../../../../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
		.reply(200, require("../../../../../test/fixtures/client/wallet.json"))
		.persist();
});

beforeEach(async () => {
	profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });

	await profile.wallets().importByMnemonic(identity.mnemonic, "ARK", "ark.devnet");

	subject = new RegistrationAggregate(profile);
});

describe("RegistrationAggregate", () => {
	it("#delegates", async () => {
		const delegates = subject.delegates();

		expect(delegates).toHaveLength(1);
		expect(delegates[0].address()).toEqual("D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib");
	});
});
