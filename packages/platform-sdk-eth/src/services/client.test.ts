import "jest-extended";

import { BigNumber } from "@arkecosystem/platform-sdk-support";
import nock from "nock";

import { createConfig } from "../../test/helpers";
import { SignedTransactionData, TransactionData, WalletData } from "../dto";
import { ClientService } from "./client";

let subject: ClientService;

beforeEach(async () => (subject = await ClientService.construct(createConfig())));

afterEach(() => nock.cleanAll());

beforeAll(() => nock.disableNetConnect());

describe("ClientService", function () {
	describe("#transaction", () => {
		it("should succeed", async () => {
			nock("https://platform.ark.io/api/eth")
				.get("/transactions/0xf6ad7f16653a2070f36c5f9c243acb30109da76658b54712745136d8e8236eae")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/transaction.json`));

			const result = await subject.transaction(
				"0xf6ad7f16653a2070f36c5f9c243acb30109da76658b54712745136d8e8236eae",
			);

			expect(result).toBeInstanceOf(TransactionData);
			expect(result.id()).toBe("0xf6ad7f16653a2070f36c5f9c243acb30109da76658b54712745136d8e8236eae");
			expect(result.type()).toBe("transfer");
			expect(result.timestamp()).toBeUndefined();
			expect(result.confirmations()).toEqual(BigNumber.ZERO);
			expect(result.sender()).toBe("0xac1a0f50604c430c25a9fa52078f7f7ec9523519");
			expect(result.recipient()).toBe("0xb5663d3a23706eb4537ffea78f56948a53ac2ebe");
			expect(result.amount().toString()).toBe("10000000000000000000");
			expect(result.fee().toString()).toBe("28000");
			expect(result.memo()).toBeUndefined();
		});
	});

	describe("#transactions", () => {
		it("should succeed", async () => {
			nock("https://platform.ark.io/api/eth")
				.get("/wallets/0x8e5231be3b71afdd0c417164986573fecddbae59/transactions")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/transactions.json`));

			const result = await subject.transactions({
				address: "0x8e5231be3b71afdd0c417164986573fecddbae59",
				limit: 1,
			});

			expect(result).toBeObject();
			expect(result.items()[0]).toBeInstanceOf(TransactionData);
		});
	});

	describe("#wallet", () => {
		it("should succeed", async () => {
			nock("https://platform.ark.io/api/eth")
				.get("/wallets/0x4581a610f96878266008993475f1476ca9997081")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/wallet.json`));

			const result = await subject.wallet("0x4581a610f96878266008993475f1476ca9997081");

			expect(result).toBeInstanceOf(WalletData);
			expect(result.address()).toBe("0xb5663d3a23706eb4537ffea78f56948a53ac2ebe");
			expect(result.publicKey()).toBeUndefined();
			expect(result.balance().toString()).toEqual("46478645338609751471");
			expect(result.nonce().toString()).toEqual("665");
		});
	});

	describe("#syncing", () => {
		it("should succeed", async () => {
			nock("https://platform.ark.io/api/eth")
				.get("/status")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/syncing.json`));

			const result = await subject.syncing();

			expect(result).toBeBoolean();
		});
	});

	describe("#broadcast", () => {
		it("should pass", async () => {
			nock("https://platform.ark.io/api/eth")
				.post("/transactions")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/broadcast.json`));

			const result = await subject.broadcast([new SignedTransactionData("id", "transactionPayload")]);

			expect(result).toEqual({
				accepted: ["0x227cff6fc8990fecd43cc9c7768f2c98cc5ee8e7c98c67c11161e008cce2b172"],
				rejected: [],
				errors: {},
			});
		});

		it("should fail", async () => {
			nock("https://platform.ark.io/api/eth")
				.post("/transactions")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/broadcast-failure.json`));

			const result = await subject.broadcast([new SignedTransactionData("id", "transactionPayload")]);

			expect(result).toEqual({
				accepted: [],
				rejected: ["0x227cff6fc8990fecd43cc9c7768f2c98cc5ee8e7c98c67c11161e008cce2b172"],
				errors: {
					"0x227cff6fc8990fecd43cc9c7768f2c98cc5ee8e7c98c67c11161e008cce2b172": ["ERR_INSUFFICIENT_FUNDS"],
				},
			});
		});
	});
});
