import "jest-extended";
import { IoC, Services, Signatories } from "@arkecosystem/platform-sdk";
import { createService } from "../test/mocking";
import { BindingType } from "./constants";
import { TransactionService } from "./transaction.service";
import { UnspentAggregator } from "./unspent-aggregator";
import { AddressService } from "./address.service";
import { AddressFactory } from "./address.factory";
import { DataTransferObjects } from "./coin.dtos";
import { identity } from "../test/fixtures/identity";
import nock from "nock";

let subject: TransactionService;

beforeEach(async () => {
	nock.disableNetConnect();

	subject = createService(TransactionService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(BindingType.AddressFactory, AddressFactory);
		container.singleton(BindingType.UnspentAggregator, UnspentAggregator);
	});
});

describe("TransactionService", () => {
	it("should create a transfer", async () => {

		nock.recorder.rec();

		const result = await subject.transfer({
			signatory: new Signatories.Signatory(
				new Signatories.HierarchicalDeterministicSignatory({
					signingKey: identity.wif,
					address: identity.addressBIP44,
					publicKey: identity.publicKey,
					privateKey: identity.privateKey,
					path: "m/44'/0'/0'/0/10",
				}),
			),
			data: {
				amount: 1,
				to: "1CBsFaD2gh53McBDaQ46fNZxQUDnyNbis6",
				memo: "foo",
			},
		});


		await expect(result.amount().toNumber()).toBe(100_000_000);
	});
});
