import "jest-extended";

import { Coins, IoC } from "@arkecosystem/platform-sdk";
import nock from "nock";

import { createService } from "../test/helpers";
import { KnownWalletService } from "./known-wallets.service";

let subject: KnownWalletService;

beforeAll(() => nock.disableNetConnect());

beforeEach(async () => {
	subject = createService(KnownWalletService);
});

afterEach(() => nock.cleanAll());

describe("KnownWalletService", () => {
	it("should return a list of known wallets if the request succeeds", async () => {
		const wallets = [
			{
				type: "team",
				name: "ACF Hot Wallet",
				address: "AagJoLEnpXYkxYdYkmdDSNMLjjBkLJ6T67",
			},
			{
				type: "team",
				name: "ACF Hot Wallet (old)",
				address: "AWkBFnqvCF4jhqPSdE2HBPJiwaf67tgfGR",
			},
		];

		nock("https://raw.githubusercontent.com")
			.get("/ArkEcosystem/common/master/devnet/known-wallets-extended.json")
			.reply(200, wallets);

		await expect(subject.all()).resolves.toEqual(wallets);
	});

	it("should return an empty list if the request fails", async () => {
		nock("https://raw.githubusercontent.com")
			.get("/ArkEcosystem/common/master/devnet/known-wallets-extended.json")
			.reply(404);

		await expect(subject.all()).resolves.toEqual([]);
	});

	it("should return an empty list if the request response is not an array", async () => {
		nock("https://raw.githubusercontent.com")
			.get("/ArkEcosystem/common/master/devnet/known-wallets-extended.json")
			.reply(200, {});

		await expect(subject.all()).resolves.toEqual([]);
	});

	it("should return an empty list if the source is empty", async () => {
		subject = createService(KnownWalletService, undefined, async (container: IoC.Container) => {
			container
				.get<Coins.ConfigRepository>(IoC.BindingType.ConfigRepository)
				.forget(Coins.ConfigKey.KnownWallets);
		});

		await expect(subject.all()).resolves.toEqual([]);
	});
});
