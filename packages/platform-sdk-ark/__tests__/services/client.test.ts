import "jest-extended";
import nock from "nock";

import { ClientService } from "../../src/services/client";
import { DelegateData, TransactionData, WalletData } from "../../src/dto";
import { createConfig } from "../helpers";

let subject: ClientService;

beforeEach(async () => (subject = await ClientService.construct(createConfig())));

afterEach(() => nock.cleanAll());

beforeAll(() => nock.disableNetConnect());

describe("ClientService", function () {
	describe("#transaction", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/transactions/3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572")
				.reply(200, require(`${__dirname}/../__fixtures__/client/transaction.json`));

			const result = await subject.transaction(
				"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
			);

			expect(result).toBeInstanceOf(TransactionData);
		});
	});

	describe("#transactions", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.post("/api/transactions/search")
				.reply(200, require(`${__dirname}/../__fixtures__/client/transactions.json`));

			const result = await subject.transactions({ address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" });

			expect(result.data).toBeArray();
			expect(result.data[0]).toBeInstanceOf(TransactionData);
		});
	});

	describe("#wallet", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/wallets/DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9")
				.reply(200, require(`${__dirname}/../__fixtures__/client/wallet.json`));

			const result = await subject.wallet("DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9");

			expect(result).toBeInstanceOf(WalletData);
		});
	});

	describe("#wallets", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.post("/api/wallets/search")
				.reply(200, require(`${__dirname}/../__fixtures__/client/wallets.json`));

			const result = await subject.wallets({ address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" });

			expect(result.data).toBeArray();
			expect(result.data[0]).toBeInstanceOf(WalletData);
		});
	});

	describe("#delegate", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/delegates/arkx")
				.reply(200, require(`${__dirname}/../__fixtures__/client/delegate.json`));

			const result = await subject.delegate("arkx");

			expect(result).toBeInstanceOf(DelegateData);
		});
	});

	describe("#delegates", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/delegates")
				.reply(200, require(`${__dirname}/../__fixtures__/client/delegates.json`));

			const result = await subject.delegates();

			expect(result.data).toBeArray();
			expect(result.data[0]).toBeInstanceOf(DelegateData);
		});
	});

	describe("#votes", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/wallets/arkx/votes")
				.reply(200, require(`${__dirname}/../__fixtures__/client/votes.json`));

			const result = await subject.votes("arkx");

			expect(result.data).toBeArray();
			expect(result.data[0]).toBeInstanceOf(TransactionData);
		});
	});

	describe("#voters", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/delegates/arkx/voters")
				.reply(200, require(`${__dirname}/../__fixtures__/client/voters.json`));

			const result = await subject.voters("arkx");

			expect(result.data).toBeArray();
			expect(result.data[0]).toBeInstanceOf(WalletData);
		});
	});

	describe("#syncing", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/node/syncing")
				.reply(200, require(`${__dirname}/../__fixtures__/client/syncing.json`));

			const result = await subject.syncing();

			expect(result).toBeBoolean();
		});
	});

	describe("#broadcast", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.post("/api/transactions")
				.reply(200, require(`${__dirname}/../__fixtures__/client/broadcast.json`));

			const result = await subject.broadcast([]);

			expect(result).toEqual({
				accepted: ["e4311204acf8a86ba833e494f5292475c6e9e0913fc455a12601b4b6b55818d8"],
				rejected: ["d4cb4edfbd50a5d71d3d190a687145530b73f041c59e2c4137fe8b3d1f970216"],
				errors: {
					d4cb4edfbd50a5d71d3d190a687145530b73f041c59e2c4137fe8b3d1f970216: ["ERR_FORGED"],
				},
			});
		});
	});
});
