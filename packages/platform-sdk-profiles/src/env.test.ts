import "jest-extended";

import { Coins } from "@arkecosystem/platform-sdk";
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { BTC } from "@arkecosystem/platform-sdk-btc";
import { ETH } from "@arkecosystem/platform-sdk-eth";
import { Request } from "@arkecosystem/platform-sdk-http-got";
import nock from "nock";

import { Environment, Identifiers, Profile } from "../src";
import storageData from "../test/fixtures/env-storage.json";
import { identity } from "../test/fixtures/identity";
import { StubStorage } from "../test/stubs/storage";
import { container } from "./container";
import { DataRepository } from "./repositories/data-repository";
import { ProfileRepository } from "./repositories/profile-repository";

let subject: Environment;

beforeAll(() => {
	nock(/.+/)
		.get("/api/node/configuration/crypto")
		.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
		.reply(200, require("../test/fixtures/client/wallet.json"))
		.persist();

	container.set(Identifiers.HttpClient, new Request());
	container.set(Identifiers.Coins, { ARK, BTC, ETH });
});

beforeEach(async () => {
	subject = new Environment({ coins: { ARK, BTC, ETH }, httpClient: new Request(), storage: new StubStorage() });

	await subject.boot();
});

it("should have a profile repository", async () => {
	expect(subject.profiles()).toBeInstanceOf(ProfileRepository);
});

it("should have a data repository", async () => {
	expect(subject.data()).toBeInstanceOf(DataRepository);
});

it("should have available networks", async () => {
	const coins: Record<string, Coins.CoinSpec> = { ARK, BTC, ETH };

	for (const network of subject.availableNetworks()) {
		expect(network.toObject()).toEqual(coins[network.coin()].manifest.networks[network.id()]);
	}
});

it("should create a profile with data and persist it when instructed to do so", async () => {
	/**
	 * Save data in the current environment.
	 */

	const profile = subject.profiles().create("John Doe");

	// Create a Contact
	profile.contacts().create("Jane Doe");

	// Create a Wallet
	await profile.wallets().import(identity.mnemonic, "ARK", "devnet");

	// Create a Notification
	profile.notifications().push({
		icon: "warning",
		name: "Ledger Update Available",
		body: "...",
		action: "Read Changelog",
	});

	// Create a DataEntry
	profile.data().set("key", "value");

	// Create a Setting
	profile.settings().set("ADVANCED_MODE", "value");

	// Create a Global DataEntry
	subject.data().set("key", "value");

	// Persist the data for the next instance to use.
	await subject.persist();

	/**
	 * Load data that the previous environment instance saved.
	 */

	const newEnv = new Environment({ coins: { ARK }, httpClient: new Request(), storage: new StubStorage() });
	await newEnv.boot();

	const newProfile = newEnv.profiles().findById(profile.id());

	expect(newProfile).toBeInstanceOf(Profile);
	expect(newProfile.wallets().keys()).toHaveLength(1);
	expect(newProfile.contacts().keys()).toHaveLength(1);
	expect(newProfile.notifications().keys()).toHaveLength(1);
	expect(newProfile.data().all()).toEqual({ key: "value" });
	expect(newProfile.settings().all()).toEqual({ ADVANCED_MODE: "value" });
});

it("should boot the environment from fixed data", async () => {
	const env = new Environment({ coins: { ARK }, httpClient: new Request(), storage: new StubStorage() });
	await env.bootFromObject(storageData);

	const newProfile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");

	expect(newProfile).toBeInstanceOf(Profile);
	expect(newProfile.wallets().keys()).toHaveLength(1);
	expect(newProfile.contacts().keys()).toHaveLength(1);
	expect(newProfile.notifications().keys()).toHaveLength(1);
	expect(newProfile.data().all()).toEqual({ key: "value" });
	expect(newProfile.settings().all()).toEqual({ ADVANCED_MODE: "value" });
});
