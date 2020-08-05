import "jest-extended";

import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Request } from "@arkecosystem/platform-sdk-http-got";
import nock from "nock";
import { v4 as uuidv4 } from "uuid";

import { identity } from "../../../test/fixtures/identity";
import { container } from "../../environment/container";
import { Identifiers } from "../../environment/container.models";
import { Profile } from "../../profiles/profile";
import { ProfileSetting } from "../../profiles/profile.models";
import { Wallet } from "../wallet";
import { DelegateMapper } from "./delegate-mapper";

let wallet: Wallet;

beforeAll(() => {
	nock.disableNetConnect();

	nock(/.+/)
		.get("/api/node/configuration")
		.reply(200, require("../../../test/fixtures/client/configuration.json"))
		.get("/api/peers")
		.reply(200, require("../../../test/fixtures/client/peers.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../../../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../../../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
		.reply(200, require("../../../test/fixtures/client/wallet.json"))
		.get("/api/delegates?page=1")
		.reply(200, require("../../../test/fixtures/client/delegates-1.json"))
		.get("/api/delegates?page=2")
		.reply(200, require("../../../test/fixtures/client/delegates-2.json"))
		.persist();
});

beforeEach(async () => {
	container.set(Identifiers.HttpClient, new Request());
	container.set(Identifiers.Coins, { ARK });

	wallet = new Wallet(uuidv4(), new Profile("profile-id"));

	await wallet.setCoin("ARK", "devnet");
	await wallet.setIdentity(identity.mnemonic);
});

it("should map the public keys to read-only wallets", async () => {
	const delegates = require("../../../test/fixtures/client/delegates-1.json").data;
	const addresses = delegates.map((delegate) => delegate.addresses);
	const publicKeys = delegates.map((delegate) => delegate.publicKey);
	const usernames = delegates.map((delegate) => delegate.usernames);

	await wallet.syncDelegates();

	const mappedDelegates = new DelegateMapper(wallet).map(publicKeys);

	expect(mappedDelegates).toBeArray();
	expect(mappedDelegates).toHaveLength(100);

	for (let i = 0; i < delegates; i++) {
		expect(mappedDelegates[i].address()).toBe(addresses[i]);
		expect(mappedDelegates[i].publicKey()).toBe(publicKeys[i]);
		expect(mappedDelegates[i].username()).toBe(usernames[i]);
	}
});
