import "jest-extended";
import "reflect-metadata";

import nock from "nock";

import { identity } from "../../../../test/fixtures/identity";
import { bootContainer } from "../../../../test/helpers";
import { IProfile, IReadWriteWallet } from "../../../contracts";
import { container } from "../../../environment/container";
import { Identifiers } from "../../../environment/container.models";
import { ProfileRepository } from "../repositories/profile-repository";
import { WalletService } from "./wallet-service";

let profile: IProfile;
let wallet: IReadWriteWallet;
let subject: WalletService;

let liveSpy: jest.SpyInstance;
let testSpy: jest.SpyInstance;

beforeAll(() => bootContainer());

beforeEach(async () => {
	nock.cleanAll();

	nock(/.+/)
		.get("/api/node/configuration")
		.reply(200, require("../../../../test/fixtures/client/configuration.json"))
		.get("/api/peers")
		.reply(200, require("../../../../test/fixtures/client/peers.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../../../../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../../../../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
		.reply(200, require("../../../../test/fixtures/client/wallet.json"))
		.get("/api/delegates")
		.reply(200, require("../../../../test/fixtures/client/delegates-1.json"))
		.get("/api/delegates?page=2")
		.reply(200, require("../../../../test/fixtures/client/delegates-2.json"))
		// coingecho
		.get("/api/v3/coins/dark/history")
		.query(true)
		.reply(200, {
			id: "ark",
			symbol: "ark",
			name: "Ark",
			market_data: {
				current_price: {
					btc: 0.0006590832396635801,
				},
				market_cap: {
					btc: 64577.8220851173,
				},
				total_volume: {
					btc: 3054.8117101964535,
				},
			},
		})
		// coingecho
		.get("/api/v3/coins/list")
		.query(true)
		.reply(200, [
			{
				id: "ark",
				symbol: "ark",
				name: "ark",
			},
			{
				id: "dark",
				symbol: "dark",
				name: "dark",
			},
		])
		.persist();

	const profileRepository = new ProfileRepository();

	container.rebind(Identifiers.ProfileRepository, profileRepository);

	profile = profileRepository.create("John Doe");

	wallet = await profile.wallets().importByMnemonic(identity.mnemonic, "ARK", "ark.devnet");

	liveSpy = jest.spyOn(wallet.network(), "isLive").mockReturnValue(true);
	testSpy = jest.spyOn(wallet.network(), "isTest").mockReturnValue(false);

	subject = new WalletService();
});

afterEach(() => {
	liveSpy.mockRestore();
	testSpy.mockRestore();
});

beforeAll(() => nock.disableNetConnect());

describe("WalletService", () => {
	it("#syncAll", async () => {
		expect(() => wallet.votes()).toThrowError(/has not been synced/);
		await subject.syncAll();
		expect(() => wallet.votes()).not.toThrowError(/has not been synced/);

		// @ts-ignore
		const mockUndefinedWallets = jest.spyOn(profile.wallets(), "values").mockReturnValue([undefined]);
		await subject.syncAll();
		mockUndefinedWallets.mockRestore();
	});

	it("#syncByProfile", async () => {
		expect(() => wallet.votes()).toThrowError(/has not been synced/);
		await subject.syncByProfile(profile);
		expect(() => wallet.votes()).not.toThrowError(/has not been synced/);

		// @ts-ignore
		const mockUndefinedWallets = jest.spyOn(profile.wallets(), "values").mockReturnValue([undefined]);
		await subject.syncByProfile(profile);
		mockUndefinedWallets.mockRestore();
	});
});
