import "jest-extended";
import "reflect-metadata";

import { Base64 } from "@arkecosystem/platform-sdk-crypto";
import nock from "nock";

import { identity } from "../../../../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../../../../test/helpers";
import { Profile } from "./profile";
import { IProfile, IProfileRepository, ProfileSetting } from "../../../contracts";
import { State } from "../../../environment/state";
import { ProfileImporter } from "./profile.importer";
import { ProfileDumper } from "./profile.dumper";
import { ProfileSerialiser } from "./profile.serialiser";
import { container } from "../../../environment/container";
import { Identifiers } from "../../../environment/container.models";

let subject: ProfileImporter;
let dumper: ProfileDumper;
let serialiser: ProfileSerialiser;
let profile: IProfile;

beforeAll(() => {
	bootContainer();

	nock.disableNetConnect();

	nock(/.+/)
		.get("/api/node/configuration/crypto")
		.reply(200, require("../../../../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/peers")
		.reply(200, require("../../../../test/fixtures/client/peers.json"))
		.get("/api/node/syncing")
		.reply(200, require("../../../../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
		.reply(200, require("../../../../test/fixtures/client/wallet.json"))
		.get("/api/wallets/DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w")
		.reply(200, require("../../../../test/fixtures/client/wallet-2.json"))
		.persist();
});

beforeEach(() => {
	container.get<IProfileRepository>(Identifiers.ProfileRepository).flush();

	subject = new ProfileImporter();
	dumper = new ProfileDumper();
	serialiser = new ProfileSerialiser();
	profile = container.get<IProfileRepository>(Identifiers.ProfileRepository).create("John Doe");

	State.profile(profile);
});

describe("#restore", () => {
	it("should restore a profile with a password", async () => {
		profile.auth().setPassword("password");

		const profileCopy: IProfile = new Profile(dumper.dump(profile));

		await importByMnemonic(profileCopy, identity.mnemonic, "ARK", "ark.devnet");

		await subject.import(profileCopy, "password");
		await profileCopy.sync();

		expect(serialiser.toJSON(profile)).toContainAllKeys([
			"contacts",
			"data",
			"notifications",
			"peers",
			"plugins",
			"data",
			"settings",
			"wallets",
		]);
	});

	it("should fail to restore a profile with corrupted data", async () => {
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

		await expect(subject.import(profile)).rejects.toThrow();
	});

	it("should restore a profile without a password", async () => {
		const profileCopy: IProfile = new Profile(dumper.dump(profile));

		await subject.import(profileCopy);

		expect(serialiser.toJSON(profile)).toEqual(serialiser.toJSON(profileCopy));
	});

	it("should fail to restore if profile is not using password but password is passed", async () => {
		const profileCopy: IProfile = new Profile(dumper.dump(profile));

		await expect(subject.import(profileCopy, "password")).rejects.toThrow(
			"Failed to decode or decrypt the profile. Reason: This profile does not use a password but password was passed for decryption",
		);
	});

	it("should fail to restore a profile with a password if no password was provided", async () => {
		profile.auth().setPassword("password");

		const profileCopy: IProfile = new Profile(dumper.dump(profile));

		await expect(subject.import(profileCopy)).rejects.toThrow("Failed to decode or decrypt the profile.");
	});

	it("should fail to restore a profile with a password if an invalid password was provided", async () => {
		profile.auth().setPassword("password");

		const profileCopy: IProfile = new Profile(dumper.dump(profile));

		await expect(subject.import(profileCopy, "invalid-password")).rejects.toThrow("Failed to decode or decrypt the profile.");
	});

	it("should restore a profile with wallets", async () => {
		const withWallets = {
			id: "uuid",
			contacts: {},
			data: { key: "value" },
			notifications: {},
			peers: {},
			plugins: {
				data: {},
			},
			settings: {
				THEME: "dark",
			},
			wallets: {
				"88ff9e53-7d40-420d-8f39-9f24acee2164": {
					id: "88ff9e53-7d40-420d-8f39-9f24acee2164",
					coin: "ARK",
					network: "ark.devnet",
					address: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
					publicKey: "034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
					data: {
						BALANCE: {},
						SEQUENCE: {},
					},
					settings: {
						AVATAR: "...",
					},
				},
				"ac38fe6d-4b67-4ef1-85be-17c5f6841129": {
					id: "ac38fe6d-4b67-4ef1-85be-17c5f6841129",
					coin: "ARK",
					network: "ark.devnet",
					address: "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
					publicKey: "034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
					data: {
						BALANCE: {},
						SEQUENCE: {},
					},
					settings: {
						ALIAS: "Johnathan Doe",
						AVATAR: "...",
					},
				},
			},
		};

		const profileDump = {
			id: "uuid",
			name: "name",
			avatar: "avatar",
			password: undefined,
			data: Base64.encode(JSON.stringify(withWallets)),
		};

		const profile = new Profile(profileDump);
		await subject.import(profile);

		expect(profile.wallets().count()).toEqual(2);
		expect(profile.settings().get(ProfileSetting.Theme)).toEqual("dark");
	});
});
