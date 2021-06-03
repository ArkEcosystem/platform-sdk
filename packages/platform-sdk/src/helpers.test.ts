import "jest-extended";

import { Config } from "./coins";
import { TransactionDataCollection } from "./collections";
import {
	createTransactionDataCollectionWithType,
	createTransactionDataWithType,
	filterHostsFromConfig,
	pluckAddress,
	randomNetworkHostFromConfig,
	randomHostFromConfig,
	toRawUnit,
} from "./helpers";

class TransactionData {
	public isDelegateRegistration(): boolean {
		return false;
	}

	public isDelegateResignation(): boolean {
		return false;
	}

	public isMagistrate(): boolean {
		return false;
	}

	public isHtlcClaim(): boolean {
		return false;
	}

	public isHtlcLock(): boolean {
		return false;
	}

	public isHtlcRefund(): boolean {
		return false;
	}

	public isIpfs(): boolean {
		return false;
	}

	public isMultiPayment(): boolean {
		return false;
	}

	public isMultiSignature(): boolean {
		return false;
	}

	public isSecondSignature(): boolean {
		return false;
	}

	public isTransfer(): boolean {
		return false;
	}

	public isVote(): boolean {
		return false;
	}

	public isUnvote(): boolean {
		return false;
	}
}

class DelegateRegistrationData {}
class DelegateResignationData {}
class HtlcClaimData {}
class HtlcLockData {}
class HtlcRefundData {}
class IpfsData {}
class MultiPaymentData {}
class MultiSignatureData {}
class SecondSignatureData {}
class TransferData {}
class VoteData {}
class UnvoteData {}

afterEach(() => jest.restoreAllMocks());

test("#createTransactionDataWithType (unknown type)", () => {
	expect(createTransactionDataWithType({}, { TransactionData })).toBeInstanceOf(TransactionData);
});

test.each([
	["isDelegateRegistration", "DelegateRegistrationData", DelegateRegistrationData],
	["isDelegateResignation", "DelegateResignationData", DelegateResignationData],
	["isHtlcClaim", "HtlcClaimData", HtlcClaimData],
	["isHtlcLock", "HtlcLockData", HtlcLockData],
	["isHtlcRefund", "HtlcRefundData", HtlcRefundData],
	["isIpfs", "IpfsData", IpfsData],
	["isMultiPayment", "MultiPaymentData", MultiPaymentData],
	["isMultiSignature", "MultiSignatureData", MultiSignatureData],
	["isSecondSignature", "SecondSignatureData", SecondSignatureData],
	["isTransfer", "TransferData", TransferData],
	["isVote", "VoteData", VoteData],
	["isUnvote", "VoteData", UnvoteData],
])("#createTransactionDataWithType (%s)", (method, dtoName, dtoClass) => {
	// @ts-ignore
	jest.spyOn(TransactionData.prototype, method).mockReturnValue(true);

	expect(createTransactionDataWithType({}, { [dtoName]: dtoClass, TransactionData })).toBeInstanceOf(dtoClass);
});

test.each([
	["isDelegateRegistration", "DelegateRegistrationData", DelegateRegistrationData],
	["isDelegateResignation", "DelegateResignationData", DelegateResignationData],
	["isHtlcClaim", "HtlcClaimData", HtlcClaimData],
	["isHtlcLock", "HtlcLockData", HtlcLockData],
	["isHtlcRefund", "HtlcRefundData", HtlcRefundData],
	["isIpfs", "IpfsData", IpfsData],
	["isMultiPayment", "MultiPaymentData", MultiPaymentData],
	["isMultiSignature", "MultiSignatureData", MultiSignatureData],
	["isSecondSignature", "SecondSignatureData", SecondSignatureData],
	["isTransfer", "TransferData", TransferData],
	["isVote", "VoteData", VoteData],
	["isUnvote", "VoteData", UnvoteData],
])("#createTransactionDataCollectionWithType (%s)", (method, dtoName, dtoClass) => {
	// @ts-ignore
	jest.spyOn(TransactionData.prototype, method).mockReturnValue(true);

	expect(
		createTransactionDataCollectionWithType(
			[{}],
			{ prev: 1, self: 2, next: 3, last: 3 },
			{ [dtoName]: dtoClass, TransactionData },
		),
	).toBeInstanceOf(TransactionDataCollection);
});

const configMock = ({
	get: () => [
		{
			type: "full",
			host: "https://wallets.ark.io",
		},
		{
			type: "musig",
			host: "https://musig1.ark.io",
		},
		{
			type: "explorer",
			host: "https://explorer.ark.io",
		},
	],
} as unknown) as Config;

test("filterHostsFromConfig", () => {
	expect(filterHostsFromConfig(configMock, "explorer")).toEqual([
		{
			type: "explorer",
			host: "https://explorer.ark.io",
		},
	]);
});

test("randomNetworkHostFromConfig", () => {
	expect(randomNetworkHostFromConfig(configMock, "explorer")).toEqual({
		type: "explorer",
		host: "https://explorer.ark.io",
	});
});

test("randomNetworkHostFromConfig default", () => {
	expect(randomNetworkHostFromConfig(configMock)).toEqual({
		type: "full",
		host: "https://wallets.ark.io",
	});
});

test("randomHostFromConfig default", () => {
	expect(randomHostFromConfig(configMock)).toBe("https://wallets.ark.io");
});

describe("pluckAddress", () => {
	test("senderId", () => {
		expect(pluckAddress({ senderId: "senderId" })).toBe("senderId");
	});

	test("recipientId", () => {
		expect(pluckAddress({ recipientId: "recipientId" })).toBe("recipientId");
	});

	test("address", () => {
		expect(pluckAddress({ address: "address" })).toBe("address");
	});

	test("addresses", () => {
		expect(pluckAddress({ addresses: ["addresses"] })).toBe("addresses");
	});

	test("addresses", () => {
		expect(() => pluckAddress({ key: "value" })).toThrow("Failed to pluck any address.");
	});
});

test("#toRawUnit", () => {
	const configMock = ({ get: () => 8 } as unknown) as Config;

	expect(toRawUnit(42, configMock).toNumber()).toBe(4_200_000_000);
});
