import { IoC } from "@arkecosystem/platform-sdk";
import "jest-extended";

import nock from "nock";

import { createConfig, createService } from "../../test/helpers";
import { TransactionData, WalletData } from "../dto";
import { ClientService } from "./client";
import { DataTransferObjectService } from "./data-transfer-object";

let subject: ClientService;

beforeAll(() => {
	nock.disableNetConnect();
});

beforeEach(async () => {
	subject = createService(ClientService, undefined, container => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.DataTransferObjectService, DataTransferObjectService);
	});
});

afterEach(() => nock.cleanAll());

describe("ClientService", () => {
	describe("#transaction", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/transactions/3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/transaction.json`));

			const result = await subject.transaction(
				"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
			);

			expect(result).toBeInstanceOf(TransactionData);
		});
	});

	describe("#transactions", () => {
		it("should work with Core 2.0", async () => {
			subject = createService(ClientService, createConfig({ network: "ark.mainnet" }), container => {
				container.constant(IoC.BindingType.Container, container);
				container.singleton(IoC.BindingType.DataTransferObjectService, DataTransferObjectService);
			});

			nock(/.+/)
				.post("/api/transactions/search")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/transactions.json`));

			const result = await subject.transactions({ addresses: ["DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8"] });

			expect(result).toBeObject();
			expect(result.items()[0]).toBeInstanceOf(TransactionData);
		});

		it("should work with Core 3.0", async () => {
			subject = createService(ClientService, createConfig({ network: "ark.devnet" }), container => {
				container.constant(IoC.BindingType.Container, container);
				container.singleton(IoC.BindingType.DataTransferObjectService, DataTransferObjectService);
			});

			nock(/.+/)
				.get("/api/transactions")
				.query({ address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" })
				.reply(200, require(`${__dirname}/../../test/fixtures/client/transactions.json`));

			const result = await subject.transactions({ addresses: ["DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8"] });

			expect(result).toBeObject();
			expect(result.items()[0]).toBeInstanceOf(TransactionData);
		});

		it("should work with Core 3.0 for advanced search", async () => {
			subject = createService(ClientService, createConfig({ network: "ark.devnet" }), container => {
				container.constant(IoC.BindingType.Container, container);
				container.singleton(IoC.BindingType.DataTransferObjectService, DataTransferObjectService);
			});

			nock(/.+/)
				.get("/api/transactions")
				.query({
					address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8",
					"asset.type": "4",
					"asset.action": "0",
					type: "6",
					typeGroup: 2,
				})
				.reply(200, require(`${__dirname}/../../test/fixtures/client/transactions.json`));

			const result = await subject.transactions({
				addresses: ["DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8"],
				asset: { type: 4, action: 0 },
				type: 6,
				typeGroup: 2,
			});

			expect(result).toBeObject();
			expect(result.items()[0]).toBeInstanceOf(TransactionData);
		});
	});

	describe("#wallet", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/wallets/DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/wallet.json`));

			const result = await subject.wallet("DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9");

			expect(result).toBeInstanceOf(WalletData);
		});
	});

	describe("#wallets", () => {
		it("should work with Core 2.0", async () => {
			subject = createService(ClientService, createConfig({ network: "ark.mainnet" }), container => {
				container.constant(IoC.BindingType.Container, container);
				container.singleton(IoC.BindingType.DataTransferObjectService, DataTransferObjectService);
			});

			nock(/.+/)
				.post("/api/wallets/search")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/wallets.json`));

			const result = await subject.wallets({ addresses: ["DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8"] });

			expect(result).toBeObject();
			expect(result.items()[0]).toBeInstanceOf(WalletData);
		});

		it("should work with Core 3.0", async () => {
			subject = createService(ClientService, createConfig({ network: "ark.devnet" }), container => {
				container.constant(IoC.BindingType.Container, container);
				container.singleton(IoC.BindingType.DataTransferObjectService, DataTransferObjectService);
			});

			nock(/.+/)
				.get("/api/wallets")
				.query({ address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" })
				.reply(200, require(`${__dirname}/../../test/fixtures/client/wallets.json`));

			const result = await subject.wallets({ addresses: ["DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8"] });

			expect(result).toBeObject();
			expect(result.items()[0]).toBeInstanceOf(WalletData);
		});
	});

	describe("#delegate", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/delegates/arkx")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/delegate.json`));

			const result = await subject.delegate("arkx");

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

	describe("#votes", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/wallets/arkx")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/wallet.json`));

			const result = await subject.votes("arkx");

			expect(result).toBeObject();
			expect(result.used).toBe(1);
			expect(result.available).toBe(0);
			expect(result.publicKeys).toHaveLength(1);
		});
	});

	describe("#voters", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/delegates/arkx/voters")
				.reply(200, require(`${__dirname}/../../test/fixtures/client/voters.json`));

			const result = await subject.voters("arkx");

			expect(result).toBeObject();
			expect(result.items()[0]).toBeInstanceOf(WalletData);
		});
	});

	describe("#broadcast", () => {
		it("should accept 1 transaction and reject 1 transaction", async () => {
			nock(/.+/)
				.post("/api/transactions")
				.reply(422, require(`${__dirname}/../../test/fixtures/client/broadcast.json`));

			const result = await subject.broadcast([]);

			expect(result).toEqual({
				accepted: ["e4311204acf8a86ba833e494f5292475c6e9e0913fc455a12601b4b6b55818d8"],
				rejected: ["d4cb4edfbd50a5d71d3d190a687145530b73f041c59e2c4137fe8b3d1f970216"],
				errors: {
					d4cb4edfbd50a5d71d3d190a687145530b73f041c59e2c4137fe8b3d1f970216: ["ERR_UNKNOWN"],
				},
			});
		});
	});
});
