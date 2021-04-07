import "jest-extended";

import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import nock from "nock";

import { ledger } from "../../test/fixtures/ledger";
import { createConfig } from "../../test/helpers";
import { LedgerService } from "./ledger";

const createMockService = async (record: string) => {
	const config = createConfig(undefined, {
		networkConfiguration: {
			crypto: require(`${__dirname}/../../test/fixtures/client/cryptoConfiguration.json`).data,
			status: require(`${__dirname}/../../test/fixtures/client/syncing.json`).data,
		},
	});
	const transport = await LedgerService.__construct(config);

	const fromString = RecordStore.fromString(record);
	await transport.connect(createTransportReplayer(fromString));

	return transport;
};

describe("constructor", () => {
	it("should pass with an empty configuration", async () => {
		const transport = await LedgerService.__construct(
			createConfig(
				{
					services: {
						ledger: {},
					},
				},
				{
					networkConfiguration: {
						crypto: require(`${__dirname}/../../test/fixtures/client/cryptoConfiguration.json`).data,
						status: require(`${__dirname}/../../test/fixtures/client/syncing.json`).data,
					},
				},
			),
		);

		expect(transport).toBeInstanceOf(LedgerService);
	});
});

describe("destruct", () => {
	it("should pass with a resolved transport closure", async () => {
		const ark = await createMockService("");

		await expect(ark.__destruct()).resolves.toBeUndefined();
	});
});

describe("getVersion", () => {
	it("should pass with an app version", async () => {
		const ark = await createMockService(ledger.appVersion.record);

		await expect(ark.getVersion()).resolves.toEqual(ledger.appVersion.result);
	});
});

describe("getPublicKey", () => {
	it("should pass with a compressed publicKey", async () => {
		const ark = await createMockService(ledger.publicKey.record);

		await expect(ark.getPublicKey(ledger.bip44.path)).resolves.toEqual(ledger.publicKey.result);
	});
});

describe("signTransaction", () => {
	it("should pass with a schnorr signature", async () => {
		const ark = await createMockService(ledger.transaction.schnorr.record);

		await expect(
			ark.signTransaction(ledger.bip44.path, Buffer.from(ledger.transaction.schnorr.payload, "hex")),
		).resolves.toEqual(ledger.transaction.schnorr.result);
	});
});

describe("signMessage", () => {
	it("should pass with a schnorr signature", async () => {
		const ark = await createMockService(ledger.message.schnorr.record);

		await expect(
			ark.signMessage(ledger.bip44.path, Buffer.from(ledger.message.schnorr.payload, "hex")),
		).resolves.toEqual(ledger.message.schnorr.result);
	});
});

describe("scan", () => {
	afterEach(() => nock.cleanAll());

	beforeAll(() => nock.disableNetConnect());

	it("should return scanned wallet", async () => {
		nock(/.+/)
			.get(
				"/api/wallets?address=D9xJncW4ECUSJQWeLP7wncxhDTvNeg2HNK%2CDFgggtreMXQNQKnxHddvkaPHcQbRdK3jyJ%2CDFr1CR81idSmfgQ19KXe4M6keqUEAuU8kF%2CDTYiNbvTKveMtJC8KPPdBrgRWxfPxGp1WV%2CDJyGFrZv4MYKrTMcjzEyhZzdTAJju2Rcjr",
			)
			.reply(200, require(`${__dirname}/../../test/fixtures/client/wallets-page-0.json`))
			.get(
				"/api/wallets?address=DHnV81YdhYDkwCLD8pkxiXh53pGFw435GS%2CDGhLzafzQpBYjDAWP41U4cx5CKZ5BdSnS3%2CDLVXZyKFxLLdyuEtJRUvFoKcorSrnBnq48%2CDFZAfJ1i1LsvhkUk76Piw4v7oTgq12pX9Z%2CDGfNF9bGPss6YKLEqK5gwr4C1M7vgfenzn",
			)
			.reply(200, require(`${__dirname}/../../test/fixtures/client/wallets-page-1.json`));

		const ark = await createMockService(ledger.wallets.record);

		const walletData = await ark.scan({ useLegacy: true });
		expect(Object.keys(walletData)).toHaveLength(1);
		expect(walletData).toMatchSnapshot();
		expect(walletData["44'/1'/0'/0/0"].toObject()).toMatchSnapshot();
	});
});
