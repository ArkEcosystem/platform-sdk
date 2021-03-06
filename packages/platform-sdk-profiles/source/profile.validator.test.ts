import "jest-extended";
import "reflect-metadata";

import { Base64 } from "@arkecosystem/platform-sdk-crypto";
import nock from "nock";

import { bootContainer } from "../test/mocking";
import { Profile } from "./profile";
import { IProfile, IProfileRepository, ProfileSetting } from "./contracts";
import { ProfileImporter } from "./profile.importer";
import { ProfileDumper } from "./profile.dumper";
import { container } from "./container";
import { Identifiers } from "./container.models";
import { ProfileValidator } from "./profile.validator";

let subject: ProfileImporter;
let validator: ProfileValidator;
let dumper: ProfileDumper;
let profile: IProfile;

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

beforeEach(() => {
	container.get<IProfileRepository>(Identifiers.ProfileRepository).flush();

	profile = container.get<IProfileRepository>(Identifiers.ProfileRepository).create("John Doe");
	subject = new ProfileImporter(profile);
	validator = new ProfileValidator();
	dumper = new ProfileDumper(profile);
});

describe("#validate", () => {
	it("should succesfully validate profile data", async () => {
		const validProfileData = {
			id: "uuid",
			contacts: {
				"448042c3-a405-4895-970e-a33c6e907905": {
					id: "448042c3-a405-4895-970e-a33c6e907905",
					name: "John",
					starred: false,
					addresses: [
						{
							id: "3a7a9e03-c10b-4135-88e9-92e586d53e69",
							coin: "ARK",
							network: "ark.devnet",
							address: "test",
						},
						{
							id: "dfc3a16d-47b8-47f2-9b6f-fe4b8365a64a",
							coin: "ARK",
							network: "ark.mainnet",
							address: "test",
						},
					],
				},
			},
			data: { key: "value" },
			notifications: {},
			peers: {},
			plugins: {
				data: {},
			},
			settings: {
				[ProfileSetting.AdvancedMode]: false,
				[ProfileSetting.AutomaticSignOutPeriod]: 60,
				[ProfileSetting.Bip39Locale]: "english",
				[ProfileSetting.DashboardTransactionHistory]: false,
				[ProfileSetting.DoNotShowFeeWarning]: false,
				[ProfileSetting.ErrorReporting]: false,
				[ProfileSetting.ExchangeCurrency]: "ADA",
				[ProfileSetting.Locale]: "en-US",
				[ProfileSetting.MarketProvider]: "coingecko",
				[ProfileSetting.Name]: "John Doe",
				[ProfileSetting.NewsFilters]: JSON.stringify({ categories: [], coins: ["ARK"] }),
				[ProfileSetting.ScreenshotProtection]: false,
				[ProfileSetting.Theme]: "dark",
				[ProfileSetting.TimeFormat]: "HH::MM",
				[ProfileSetting.UseTestNetworks]: false,
			},
			wallets: {},
		};

		validator = new ProfileValidator();

		expect(validator.validate(validProfileData).settings).toEqual(validProfileData.settings);
	});

	it("should fail to validate", async () => {
		const corruptedProfileData = {
			// id: 'uuid',
			contacts: {},
			data: {},
			notifications: {},
			peers: {},
			plugins: { data: {} },
			settings: { NAME: "John Doe" },
			wallets: {},
		};

		const profile: IProfile = new Profile({
			id: "uuid",
			name: "name",
			avatar: "avatar",
			password: undefined,
			data: Base64.encode(JSON.stringify(corruptedProfileData)),
		});

		validator = new ProfileValidator();

		//@ts-ignore
		expect(() => validator.validate(corruptedProfileData)).toThrow();
	});

	it("should apply migrations if any are set", async () => {
		const migrationFunction = jest.fn();
		const migrations = { "1.0.1": migrationFunction };

		container.constant(Identifiers.MigrationSchemas, migrations);
		container.constant(Identifiers.MigrationVersion, "1.0.2");

		subject = new ProfileImporter(new Profile(dumper.dump()));

		await subject.import();

		expect(migrationFunction).toHaveBeenCalled();
	});
});
