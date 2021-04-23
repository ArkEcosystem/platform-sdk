import "jest-extended";

import { ADA } from "@arkecosystem/platform-sdk-ada";
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { BTC } from "@arkecosystem/platform-sdk-btc";
import { ETH } from "@arkecosystem/platform-sdk-eth";
import { Request } from "@arkecosystem/platform-sdk-http-got";
import nock from "nock";

import { Contact } from "../src/drivers/memory/contacts/contact";
import { container } from "../src/environment/container";
import { Profile } from "../src/drivers/memory/profiles/profile";
import { StubStorage } from "./stubs/storage";
import { Wallet } from "../src/drivers/memory/wallets/wallet";
import { IContactData, IProfile, IReadWriteWallet } from "../src/contracts";
import { WalletFactory } from "../src/drivers/memory/wallets/wallet.factory";
import { MemoryDriver } from "../src/drivers/memory";

export const bootContainer = (): void => {
	new MemoryDriver().make(container, {
		coins: { ADA, ARK, BTC, ETH },
		storage: new StubStorage(),
		httpClient: new Request(),
	});
};

export const knock = (): void => {
	nock.disableNetConnect();

	nock(/.+/)
		.get("/api/node/configuration")
		.reply(200, require("./fixtures/client/configuration.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("./fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("./fixtures/client/syncing.json"))
		.get("/api/peers")
		.reply(200, require("./fixtures/client/peers.json"))
		.get("/api/node/fees")
		.query(true)
		.reply(200, require("./fixtures/client/node-fees.json"))
		.get("/api/transactions/fees")
		.query(true)
		.reply(200, require("./fixtures/client/transaction-fees.json"))
		.get("/api/delegates")
		.query(true)
		.reply(200, require("./fixtures/client/delegates-2.json"));
};

export const makeProfile = (data: object = {}): IProfile =>
	new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "", ...data });

export const makeContact = (data: IContactData): Contact => new Contact(data);

export const makeWallet = (id: string): IReadWriteWallet => new Wallet(id, {});

export const importByMnemonic = async (profile: IProfile, mnemonic: string, coin: string, network: string): Promise<IReadWriteWallet> => {
	const factory: WalletFactory = new WalletFactory();

	const wallet = await factory.fromMnemonic({
		coin,
		network,
		mnemonic,
	});

	profile.wallets().push(wallet);

	return wallet;
}

export const importByAddressWithLedgerPath = async (profile: IProfile, address: string, coin: string, network: string, path: string): Promise<IReadWriteWallet> => {
	const factory: WalletFactory = new WalletFactory();

	const wallet = await factory.fromAddressWithLedgerPath({
		coin,
		network,
		address,
		path,
	});

	profile.wallets().push(wallet);

	return wallet;
}

export const generateWallet = async (profile: IProfile, coin: string, network: string): Promise<IReadWriteWallet> => {
	const factory: WalletFactory = new WalletFactory();

	const { wallet } = await factory.generate({
		coin,
		network,
	});

	profile.wallets().push(wallet);

	return wallet;
}
