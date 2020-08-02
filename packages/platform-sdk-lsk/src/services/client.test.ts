import "jest-extended";

import nock from "nock";

import { createConfig } from "../../test/helpers";
import { TransactionData, WalletData } from "../dto";
import { ClientService } from "./client";

let subject: ClientService;

beforeEach(async () => (subject = await ClientService.construct(createConfig())));

beforeAll(() => nock.disableNetConnect());

describe("ClientService", function () {
	describe("#transaction", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/transactions?id=15562133894377717094")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/transaction.json`));

			const result = await subject.transaction("15562133894377717094");

			expect(result).toBeInstanceOf(TransactionData);
		});
	});

	describe("#transactions", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/transactions?address=6566229458323231555L")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/transactions.json`));

			const result = await subject.transactions({ address: "6566229458323231555L" });

			expect(result).toBeObject();
			expect(result.items()[0]).toBeInstanceOf(TransactionData);
		});
	});

	describe("#wallet", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/accounts?address=6566229458323231555L")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/wallet.json`));

			const result = await subject.wallet("6566229458323231555L");

			expect(result).toBeInstanceOf(WalletData);
		});
	});

	describe("#wallets", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/accounts?address=6566229458323231555L")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/wallets.json`));

			const result = await subject.wallets({ address: "6566229458323231555L" });

			expect(result).toBeObject();
			expect(result.items()[0]).toBeInstanceOf(WalletData);
		});
	});

	describe("#delegate", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/delegates?username=cc001")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/delegate.json`));

			const result = await subject.delegate("cc001");

			expect(result).toBeInstanceOf(WalletData);
		});
	});

	describe("#delegates", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/delegates")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/delegates.json`));

			const result = await subject.delegates();

			expect(result).toBeObject();
			expect(result.items()[0]).toBeInstanceOf(WalletData);
		});
	});

	describe("#broadcast", () => {
		const transactionPayload = {
			id: "5961193224963457718",
			amount: "1",
			type: 0,
			timestamp: 125068043,
			senderPublicKey: "ceb7bb7475a14b729eba069dfb27715331727a910acf5773a950ed4f863c89ed",
			senderId: "15957226662510576840L",
			recipientId: "15957226662510576840L",
			fee: "10000000",
			signature:
				"48580d51e30a177b854ef35771a62911140085808bf2299828202ce439faaf96dc677822279caf1bdddf99d01867cba119e9b1cd5bb7f65cbc531f6c1ce93705",
			signatures: [],
			asset: {},
		};

		it("should pass", async () => {
			nock(/.+/)
				.post("/api/transactions")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/broadcast.json`));

			const result = await subject.broadcast([transactionPayload]);

			expect(result).toEqual({
				accepted: ["5961193224963457718"],
				rejected: [],
				errors: {},
			});
		});

		it("should fail", async () => {
			nock(/.+/)
				.post("/api/transactions")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/broadcast-failure.json`));

			const result = await subject.broadcast([transactionPayload]);

			expect(result).toEqual({
				accepted: [],
				rejected: ["5961193224963457718"],
				errors: {
					"5961193224963457718": ["ERR_INSUFFICIENT_FUNDS"],
				},
			});
		});
	});
});
