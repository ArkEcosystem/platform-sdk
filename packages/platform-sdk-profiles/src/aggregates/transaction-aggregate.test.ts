import "jest-extended";

import { Coins } from "@arkecosystem/platform-sdk";
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Request } from "@arkecosystem/platform-sdk-http-got";
import nock from "nock";

import { identity } from "../../test/fixtures/identity";
import { container } from "../container";
import { Identifiers } from "../container.models";
import { Profile } from "../profile";
import { TransactionAggregate } from "./transaction-aggregate";

let subject: TransactionAggregate;

beforeAll(() => {
	nock.disableNetConnect();

	nock(/.+/)
		.get("/api/node/configuration/crypto")
		.reply(200, require("../../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/configuration")
		.reply(200, require("../../test/fixtures/client/configuration.json"))
		.get("/api/peers")
		.reply(200, require("../../test/fixtures/client/peers.json"))
		.get("/api/node/syncing")
		.reply(200, require("../../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
		.reply(200, require("../../test/fixtures/client/wallet.json"))
		.persist();

	container.set(Identifiers.HttpClient, new Request());
	container.set(Identifiers.Coins, { ARK });
});

beforeEach(async () => {
	const profile = new Profile("uuid");

	await profile.wallets().importByMnemonic(identity.mnemonic, "ARK", "devnet");

	subject = new TransactionAggregate(profile);
});

afterAll(() => nock.enableNetConnect());

describe.each(["transactions", "sentTransactions", "receivedTransactions"])("%s", (method: string) => {
	it("should have more transactions", async () => {
		nock(/.+/).post("/api/transactions/search").reply(200, require("../../test/fixtures/client/transactions.json"));

		const result = await subject[method]();

		expect(result).toBeInstanceOf(Coins.TransactionDataCollection);
		expect(result.items()).toHaveLength(100);
	});

	it("should not have more transactions", async () => {
		nock(/.+/)
			.post("/api/transactions/search")
			.reply(200, require("../../test/fixtures/client/transactions-no-more.json"));

		const result = await subject[method]();

		expect(result).toBeInstanceOf(Coins.TransactionDataCollection);
		expect(result.items()).toHaveLength(100);
		expect(subject.hasMore(method)).toBeFalse();
	});

	it("should skip error responses for processing", async () => {
		nock(/.+/).post("/api/transactions/search").reply(404);

		const result = await subject[method]();

		expect(result).toBeInstanceOf(Coins.TransactionDataCollection);
		expect(result.items()).toHaveLength(0);
		expect(subject.hasMore(method)).toBeFalse();
	});

	it("should skip empty responses for processing", async () => {
		nock(/.+/)
			.post("/api/transactions/search")
			.reply(200, require("../../test/fixtures/client/transactions-empty.json"));

		const result = await subject[method]();

		expect(result).toBeInstanceOf(Coins.TransactionDataCollection);
		expect(result.items()).toHaveLength(0);
		expect(subject.hasMore(method)).toBeFalse();
	});

	it("should fetch transactions twice and then stop because no more are available", async () => {
		nock(/.+/)
			.post("/api/transactions/search")
			.reply(200, require("../../test/fixtures/client/transactions.json"))
			.post("/api/transactions/search?page=2")
			.reply(200, require("../../test/fixtures/client/transactions-no-more.json"));

		// We receive a response that does contain a "next" cursor
		const firstRequest = await subject[method]();

		expect(firstRequest).toBeInstanceOf(Coins.TransactionDataCollection);
		expect(firstRequest.items()).toHaveLength(100);
		expect(subject.hasMore(method)).toBeTrue();

		// We receive a response that does not contain a "next" cursor
		const secondRequest = await subject[method]();

		expect(secondRequest).toBeInstanceOf(Coins.TransactionDataCollection);
		expect(secondRequest.items()).toHaveLength(100);
		expect(subject.hasMore(method)).toBeFalse();

		// We do not send any requests because no more data is available
		const thirdRequest = await subject[method]();

		expect(thirdRequest).toBeInstanceOf(Coins.TransactionDataCollection);
		expect(thirdRequest.items()).toHaveLength(0);
		expect(subject.hasMore(method)).toBeFalse();
	});

	it("should determine if it has more transactions to be requested", async () => {
		nock(/.+/).post("/api/transactions/search").reply(200, require("../../test/fixtures/client/transactions.json"));

		expect(subject.hasMore(method)).toBeFalse();

		await subject[method]();

		expect(subject.hasMore(method)).toBeTrue();
	});
});

it("should flush the history", async () => {
	nock(/.+/).post("/api/transactions/search").reply(200, require("../../test/fixtures/client/transactions.json"));

	expect(subject.hasMore("transactions")).toBeFalse();

	await subject.transactions();

	expect(subject.hasMore("transactions")).toBeTrue();

	subject.flush();

	expect(subject.hasMore("transactions")).toBeFalse();
});
