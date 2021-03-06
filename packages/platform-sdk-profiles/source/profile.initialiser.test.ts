import "jest-extended";
import "reflect-metadata";

import { Profile } from "./profile";
import { IProfile, ProfileSetting, ProfileData } from "./contracts";
import { ProfileInitialiser } from "./profile.initialiser";
import { bootContainer } from "../test/mocking";
import nock from "nock";

beforeAll(() => {
	bootContainer();

	nock.disableNetConnect();

	nock(/.+/)
		.get("/api/node/configuration/crypto")
		.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/peers")
		.reply(200, require("../test/fixtures/client/peers.json"))
		.get("/api/node/syncing")
		.reply(200, require("../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
		.reply(200, require("../test/fixtures/client/wallet.json"))
		.get("/api/wallets/DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w")
		.reply(200, require("../test/fixtures/client/wallet-2.json"))
		.persist();
});

describe("ProfileInitialiser", () => {
	let profile: IProfile;

	beforeEach(() => {
		profile = new Profile({ id: "uuid", name: "name", data: "" });
	});

	it("should flush service data", () => {
		profile.contacts().create("test");
		profile.data().set(ProfileData.HasCompletedIntroductoryTutorial, true);
		profile.settings().set(ProfileSetting.Theme, "dark");

		expect(profile.contacts().count()).toBe(1);
		expect(profile.data().get(ProfileData.HasCompletedIntroductoryTutorial)).toBeTrue();
		expect(profile.settings().get(ProfileSetting.Theme)).toBe("dark");

		new ProfileInitialiser(profile).initialise("name");

		expect(profile.contacts().count()).toBe(0);
		expect(profile.data().get(ProfileData.HasCompletedIntroductoryTutorial)).toBeUndefined();
		expect(profile.settings().get(ProfileSetting.Theme)).toBe("light");
	});

	it("should initialise the default settings", () => {
		expect(profile.settings().get(ProfileSetting.Name)).toBeUndefined();
		expect(profile.settings().get(ProfileSetting.Theme)).toBeUndefined();

		new ProfileInitialiser(profile).initialiseSettings("name");

		expect(profile.settings().get(ProfileSetting.Name)).toBe("name");
		expect(profile.settings().get(ProfileSetting.Theme)).toBe("light");
	});
});
