import "jest-extended";

import { ARK } from "@arkecosystem/platform-sdk-ark";
import { ValidatorSchema } from "@arkecosystem/platform-sdk-support";

import { Coin } from "./coin";
import { Config } from "./config";
import { Manifest } from "./manifest";
import { Network } from "./network";
import { NetworkRepository } from "./network-repository";

let subject: Coin;

const services = {
	// @ts-ignore
	client: { __destruct: jest.fn() },
	// @ts-ignore
	dataTransferObject: { __destruct: jest.fn() },
	// @ts-ignore
	fee: { __destruct: jest.fn() },
	// @ts-ignore
	identity: { __destruct: jest.fn() },
	// @ts-ignore
	knownWallets: { __destruct: jest.fn() },
	// @ts-ignore
	ledger: { __destruct: jest.fn() },
	// @ts-ignore
	link: { __destruct: jest.fn() },
	// @ts-ignore
	message: { __destruct: jest.fn() },
	// @ts-ignore
	multiSignature: { __destruct: jest.fn() },
	// @ts-ignore
	peer: { __destruct: jest.fn() },
	// @ts-ignore
	transaction: { __destruct: jest.fn() },
};

beforeEach(
	() =>
		(subject = new Coin({
			networks: new NetworkRepository(ARK.manifest.networks),
			manifest: new Manifest(ARK.manifest),
			// @ts-ignore
			config: new Config(
				{ network: "ark.mainnet" },
				ValidatorSchema.object({
					network: ValidatorSchema.string().valid("ark.mainnet", "ark.devnet"),
				}),
			),
			// @ts-ignore
			services,
		})),
);

test("#destruct", async () => {
	await subject.__destruct();

	expect(services.client.__destruct).toHaveBeenCalledTimes(1);
	expect(services.dataTransferObject.__destruct).toHaveBeenCalledTimes(1);
	expect(services.fee.__destruct).toHaveBeenCalledTimes(1);
	expect(services.identity.__destruct).toHaveBeenCalledTimes(1);
	expect(services.knownWallets.__destruct).toHaveBeenCalledTimes(1);
	expect(services.ledger.__destruct).toHaveBeenCalledTimes(1);
	expect(services.link.__destruct).toHaveBeenCalledTimes(1);
	expect(services.message.__destruct).toHaveBeenCalledTimes(1);
	expect(services.multiSignature.__destruct).toHaveBeenCalledTimes(1);
	expect(services.peer.__destruct).toHaveBeenCalledTimes(1);
	expect(services.transaction.__destruct).toHaveBeenCalledTimes(1);
});

test("#network", () => {
	expect(subject.network()).toBeInstanceOf(Network);
});

test("#networks", () => {
	expect(subject.networks()).toBeInstanceOf(NetworkRepository);
});

test("#manifest", () => {
	expect(subject.manifest()).toBeInstanceOf(Manifest);
});

test("#config", () => {
	expect(subject.config()).toBeInstanceOf(Config);
});

test("#client", () => {
	expect(subject.client()).toBeObject();
});

test("#dataTransferObject", () => {
	expect(subject.dataTransferObject()).toBeObject();
});

test("#fee", () => {
	expect(subject.fee()).toBeObject();
});

test("#identity", () => {
	expect(subject.identity()).toBeObject();
});

test("#knownWallets", () => {
	expect(subject.knownWallets()).toBeObject();
});

test("#ledger", () => {
	expect(subject.ledger()).toBeObject();
});

test("#link", () => {
	expect(subject.link()).toBeObject();
});

test("#message", () => {
	expect(subject.message()).toBeObject();
});

test("#multiSignature", () => {
	expect(subject.multiSignature()).toBeObject();
});

test("#peer", () => {
	expect(subject.peer()).toBeObject();
});

test("#transaction", () => {
	expect(subject.transaction()).toBeObject();
});
