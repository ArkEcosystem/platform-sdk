import "jest-extended";

import nock from "nock";

import { bootContainer } from "../../../../test/helpers";
import { FeeService } from "./fee-service";

let subject: FeeService;
import NodeFeesFixture from "../../../../test/fixtures/client/node-fees.json";

beforeAll(() => {
	bootContainer();

	nock.disableNetConnect();

	nock(/.+/)
		.get("/api/node/configuration")
		.reply(200, require("../../../../test/fixtures/client/configuration.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../../../../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../../../../test/fixtures/client/syncing.json"))
		.get("/api/peers")
		.reply(200, require("../../../../test/fixtures/client/peers.json"))
		.get("/api/node/fees")
		.query(true)
		.reply(200, NodeFeesFixture)
		.get("/api/transactions/fees")
		.query(true)
		.reply(200, require("../../../../test/fixtures/client/transaction-fees.json"))
		.persist();
});

beforeEach(async () => {
	subject = new FeeService();
});

describe("FeeService", () => {
	it("should sync fees", async () => {
		expect(() => subject.all("ARK", "ark.devnet")).toThrowError("have not been synchronized yet");

		await subject.sync("ARK", "ark.devnet");
		expect(Object.keys(subject.all("ARK", "ark.devnet"))).toHaveLength(11);
	});

	it("should sync fees of all coins", async () => {
		expect(() => subject.all("ARK", "ark.devnet")).toThrowError("have not been synchronized yet");

		await subject.syncAll();

		expect(Object.keys(subject.all("ARK", "ark.devnet"))).toHaveLength(11);
	});

	it("#findByType", async () => {
		expect(() => subject.all("ARK", "ark.devnet")).toThrowError("have not been synchronized yet");

		await subject.syncAll();

		expect(subject.findByType("ARK", "ark.devnet", "transfer")).toEqual({
			avg: "71538139",
			max: "663000000",
			min: "357000",
			static: "10000000",
		});
	});
});
