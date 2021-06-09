import "jest-extended";

import { Collections, IoC, Services } from "@arkecosystem/platform-sdk";
import nock from "nock";

import { createService } from "../../test/helpers";
import { WalletData } from "../dto";
import * as DataTransferObjects from "../dto";
import { ClientService } from "./client";

let subject: ClientService;

beforeAll(() => {
	nock.disableNetConnect();

	subject = createService(ClientService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
	});
});

afterEach(() => nock.cleanAll());

beforeAll(() => {
	nock.disableNetConnect();
});

describe("ClientService", () => {
	test("#transactions", async () => {
		nock("https://proxy.nanos.cc/")
			.post("/proxy/")
			.reply(200, require(`${__dirname}/../../test/fixtures/client/transactions.json`));

		const result = await subject.transactions({
			address: "nano_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3",
		});

		expect(result).toBeInstanceOf(Collections.TransactionDataCollection);

		const transaction = result.items()[0];

		expect(transaction.id()).toBe("85D0745BCE0390DDAE8B8CEA31139BEBD2F2041BB689F5518B65431337EC6532");
		expect(transaction.blockId()).toBe("85D0745BCE0390DDAE8B8CEA31139BEBD2F2041BB689F5518B65431337EC6532");
		expect(transaction.timestamp()!.toISOString()).toBe("2021-05-14T04:59:40.000Z");
		expect(transaction.sender()).toBe("nano_37cyeqb7fwafs499i9k94sthkse1iq3k59efaknb5rpdbysgq8sb9fq46qd8");
		expect(transaction.recipient()).toBe("nano_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3");
		expect(transaction.amount().toString()).toBe("336536650000000000000000000000000");
	});

	test("#wallet", async () => {
		nock("https://proxy.nanos.cc/")
			.post("/proxy/")
			.reply(200, require(`${__dirname}/../../test/fixtures/client/wallet.json`));

		const result = await subject.wallet("nano_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3");

		expect(result).toBeInstanceOf(WalletData);
		expect(result.toObject()).toMatchSnapshot();
	});
});
