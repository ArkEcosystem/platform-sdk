import "jest-extended";

import { IoC } from "@arkecosystem/platform-sdk";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";

import { ledger } from "../../test/fixtures/ledger";
import { createService } from "../../test/helpers";
import { LedgerService } from "./ledger";
import { AddressService } from "./address";
import { ClientService } from "./client";
import { DataTransferObjectService } from "./data-transfer-object";

const createMockService = async (record: string) => {
	const transport = createService(LedgerService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.singleton(IoC.BindingType.DataTransferObjectService, DataTransferObjectService);
	});

	await transport.connect(createTransportReplayer(RecordStore.fromString(record)));

	return transport;
};

describe("destruct", () => {
	it("should pass with a resolved transport closure", async () => {
		const xrp = await createMockService("");

		await expect(xrp.__destruct()).resolves.toBeUndefined();
	});
});

describe("getVersion", () => {
	it("should pass with an app version", async () => {
		const xrp = await createMockService(ledger.appVersion.record);

		await expect(xrp.getVersion()).resolves.toEqual(ledger.appVersion.result);
	});
});

describe("getPublicKey", () => {
	it("should pass with a compressed publicKey", async () => {
		const xrp = await createMockService(ledger.publicKey.record);

		await expect(xrp.getPublicKey(ledger.bip44.path)).resolves.toEqual(ledger.publicKey.result);
	});
});

describe("signTransaction", () => {
	it("should pass with a signature", async () => {
		const xrp = await createMockService(ledger.transaction.record);

		await expect(
			xrp.signTransaction(ledger.bip44.path, Buffer.from(ledger.transaction.payload, "hex")),
		).resolves.toEqual(ledger.transaction.result);
	});
});

describe("signMessage", () => {
	it("should fail with a 'NotImplemented' error", async () => {
		const xrp = await createMockService("");

		await expect(xrp.signMessage("", Buffer.alloc(0))).rejects.toThrow();
	});
});
