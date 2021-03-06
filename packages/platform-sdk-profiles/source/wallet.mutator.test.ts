import "jest-extended";
import "reflect-metadata";

import { encrypt } from "bip38";
import nock from "nock";
import { v4 as uuidv4 } from "uuid";
import { decode } from "wif";

import { identity } from "../test/fixtures/identity";
import { bootContainer } from "../test/mocking";
import { container } from "./container";
import { Identifiers } from "./container.models";
import { Wallet } from "./wallet";
import { IProfile, IProfileRepository, IReadWriteWallet, ProfileSetting, WalletData } from "./contracts";

let profile: IProfile;
let subject: IReadWriteWallet;

beforeAll(() => bootContainer());

beforeEach(async () => {
	nock.cleanAll();

	nock(/.+/)
		.get("/api/node/configuration")
		.reply(200, require("../test/fixtures/client/configuration.json"))
		.get("/api/peers")
		.reply(200, require("../test/fixtures/client/peers.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../test/fixtures/client/syncing.json"))

		// default wallet
		.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
		.reply(200, require("../test/fixtures/client/wallet.json"))
		.get("/api/wallets/030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd")
		.reply(200, require("../test/fixtures/client/wallet.json"))

		// second wallet
		.get("/api/wallets/022e04844a0f02b1df78dff2c7c4e3200137dfc1183dcee8fc2a411b00fd1877ce")
		.reply(200, require("../test/fixtures/client/wallet-2.json"))
		.get("/api/wallets/DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w")
		.reply(200, require("../test/fixtures/client/wallet-2.json"))

		// Musig wallet
		.get("/api/wallets/DML7XEfePpj5qDFb1SbCWxLRhzdTDop7V1")
		.reply(200, require("../test/fixtures/client/wallet-musig.json"))
		.get("/api/wallets/02cec9caeb855e54b71e4d60c00889e78107f6136d1f664e5646ebcb2f62dae2c6")
		.reply(200, require("../test/fixtures/client/wallet-musig.json"))

		.get("/api/delegates")
		.reply(200, require("../test/fixtures/client/delegates-1.json"))
		.get("/api/delegates?page=2")
		.reply(200, require("../test/fixtures/client/delegates-2.json"))
		.get("/api/transactions/3e0b2e5ed00b34975abd6dee0ca5bd5560b5bd619b26cf6d8f70030408ec5be3")
		.query(true)
		.reply(200, () => {
			const response = require("../test/fixtures/client/transactions.json");
			return { data: response.data[0] };
		})
		.get("/api/transactions/bb9004fa874b534905f9eff201150f7f982622015f33e076c52f1e945ef184ed")
		.query(true)
		.reply(200, () => {
			const response = require("../test/fixtures/client/transactions.json");
			return { data: response.data[1] };
		})
		.get("/api/transactions")
		.query(true)
		.reply(200, require("../test/fixtures/client/transactions.json"))
		// CryptoCompare
		.get("/data/histoday")
		.query(true)
		.reply(200, require("../test/fixtures/markets/cryptocompare/historical.json"))
		.persist();

	const profileRepository = container.get<IProfileRepository>(Identifiers.ProfileRepository);
	profileRepository.flush();
	profile = profileRepository.create("John Doe");

	subject = new Wallet(uuidv4(), {}, profile);

	await subject.mutator().coin("ARK", "ark.devnet");
	// await subject.mutator().identity(identity.mnemonic);
});

beforeAll(() => nock.disableNetConnect());

describe("#setCoin", () => {
	it("should mark the wallet as partially restored if the coin construction fails", async () => {
		subject = new Wallet(uuidv4(), {}, profile);

		expect(subject.hasBeenPartiallyRestored()).toBeFalse();

		await subject.mutator().coin("FAKE", "fake.network");

		expect(subject.hasBeenPartiallyRestored()).toBeTrue();
	});

	it("should use the default peer if no custom one is available", async () => {
		await subject.mutator().coin("ARK", "ark.devnet");

		expect(() => subject.coin().config().get("peer")).toThrow("unknown");
	});

	it("should return relays", async () => {
		profile.peers().create("ARK", "ark.devnet", {
			name: "Relay",
			host: "https://relay.com/api",
			isMultiSignature: false,
		});

		await subject.mutator().coin("ARK", "ark.devnet");

		expect(subject.getRelays()).toBeArrayOfSize(1);
	});

	it("should mutate extendedPublicKey", async () => {
		await subject.mutator().extendedPublicKey("pubKey", { syncIdentity: false, validate: true });

		expect(subject.publicKey()).toBe("pubKey");
		expect(subject.address()).toBe("pubKey");
	});
});

describe("#identity", () => {
	it("should mutate the address with a path", async () => {
		jest.spyOn(subject.coin().address(), "fromMnemonic").mockImplementation(async () => ({
			type: "bip39",
			address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			path: "path",
		}));

		expect(subject.data().has(WalletData.DerivationType)).toBeFalse();
		expect(subject.data().has(WalletData.DerivationPath)).toBeFalse();

		await subject.mutator().identity(identity.mnemonic);

		expect(subject.data().has(WalletData.DerivationType)).toBeTrue();
		expect(subject.data().has(WalletData.DerivationPath)).toBeTrue();
	});
});

describe("#address", () => {
	it("should mutate the address with a path", async () => {
		expect(subject.data().has(WalletData.DerivationType)).toBeFalse();
		expect(subject.data().has(WalletData.DerivationPath)).toBeFalse();

		await subject.mutator().address({
			type: "bip39",
			address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			path: "path",
		});

		expect(subject.data().has(WalletData.DerivationType)).toBeTrue();
		expect(subject.data().has(WalletData.DerivationPath)).toBeTrue();
	});
});
