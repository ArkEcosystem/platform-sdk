import "jest-extended";

import { BigNumber } from "@arkecosystem/platform-sdk-support";

import { Entity } from "../contracts/coins";
import { AbstractWalletData } from "./wallet";

test("#address", () => {
	expect(new Wallet({ key: "value" }).address()).toBe("address");
});

test("#publicKey", () => {
	expect(new Wallet({ key: "value" }).publicKey()).toBe("publicKey");
});

test("#balance", () => {
	expect(new Wallet({ key: "value" }).balance()).toBe(BigNumber.ZERO);
});

test("#nonce", () => {
	expect(new Wallet({ key: "value" }).nonce()).toBe(BigNumber.ZERO);
});

test("#secondPublicKey", () => {
	expect(new Wallet({ key: "value" }).secondPublicKey()).toBe("secondPublicKey");
});

test("#username", () => {
	expect(new Wallet({ key: "value" }).username()).toBe("username");
});

test("#rank", () => {
	expect(new Wallet({ key: "value" }).rank()).toBe(5);
});

test("#votes", () => {
	expect(new Wallet({ key: "value" }).votes()).toBe(BigNumber.ZERO);
});

test("#entities", () => {
	expect(new Wallet({ key: "value" }).entities()).toEqual([]);
});

test("#isDelegate", () => {
	expect(new Wallet({ key: "value" }).isDelegate()).toBeFalse();
});

test("#isMultiSignature", () => {
	expect(new Wallet({ key: "value" }).isMultiSignature()).toBeFalse();
});

test("#isSecondSignature", () => {
	expect(new Wallet({ key: "value" }).isSecondSignature()).toBeFalse();
});

test("#toObject", () => {
	expect(new Wallet({ key: "value" }).toObject()).toMatchInlineSnapshot(`
		Object {
		  "address": "address",
		  "balance": BigNumber {},
		  "nonce": BigNumber {},
		  "publicKey": "publicKey",
		  "rank": 5,
		  "username": "username",
		  "votes": BigNumber {},
		}
	`);
});

test("#raw", () => {
	expect(new Wallet({ key: "value" }).raw()).toMatchInlineSnapshot(`
		Object {
		  "key": "value",
		}
	`);
});

test("#hasPassed", () => {
	expect(new Wallet({ key: "value" }).hasPassed()).toBeTrue();
	expect(new Wallet({}).hasPassed()).toBeFalse();
});

test("#hasFailed", () => {
	expect(new Wallet({}).hasFailed()).toBeTrue();
	expect(new Wallet({ key: "value" }).hasFailed()).toBeFalse();
});

class Wallet extends AbstractWalletData {
	public primaryKey(): string {
		return "address";
	}

	public address(): string {
		return "address";
	}

	public publicKey(): string | undefined {
		return "publicKey";
	}

	public balance(): BigNumber {
		return BigNumber.ZERO;
	}

	public nonce(): BigNumber {
		return BigNumber.ZERO;
	}

	public secondPublicKey(): string | undefined {
		return "secondPublicKey";
	}

	public username(): string | undefined {
		return "username";
	}

	public rank(): number | undefined {
		return 5;
	}

	public votes(): BigNumber | undefined {
		return BigNumber.ZERO;
	}

	public entities(): Entity[] {
		return [];
	}

	public isDelegate(): boolean {
		return false;
	}

	public isMultiSignature(): boolean {
		return false;
	}

	public isSecondSignature(): boolean {
		return false;
	}
}
