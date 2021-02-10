import "jest-extended";

import { DTO } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

import Fixture from "../../test/fixtures/client/transaction.json";
import { TransactionData } from "./transaction";

describe("TransactionData", function () {
	const subject = new TransactionData(Fixture);

	it("#id", () => {
		expect(subject.id()).toEqual("35b40547f04963d3b41478fc27038948d74718802c486d9125f1884d8c83a31d");
	});

	it("#blockId", () => {
		expect(subject.blockId()).toBeUndefined();
	});

	it("#timestamp", () => {
		expect(subject.timestamp().toISOString()).toBe("2021-02-05T15:04:16.000Z");
	});

	it("#confirmations", () => {
		expect(subject.confirmations().toString()).toBe("0");
	});

	it("#sender", () => {
		expect(subject.sender()).toBe(
			"addr_test1qrhvwtn8sa3duzkm93v5kjjxlv5lvg67j530wyeumngu23lk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33s4s8xvh",
		);
	});

	it("#recipient", () => {
		expect(subject.recipient()).toBe(
			"addr_test1qzct2hsralem3fqn8fupu90v3jkelpg4rfp4zqx06zgevpachk6az8jcydma5a6vgsuw5c37v0c8j6rlclpqajn2vxsq3rz4th",
		);
	});

	it("#recipients", () => {
		expect(subject.recipients()).toEqual([
			"addr_test1qzct2hsralem3fqn8fupu90v3jkelpg4rfp4zqx06zgevpachk6az8jcydma5a6vgsuw5c37v0c8j6rlclpqajn2vxsq3rz4th",
			"addr_test1qzfjfm724nv9qz6nfyagmj0j2uppr35gzv5qee8s7489wxlk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33scc4thv",
		]);
	});

	it("#inputs", () => {
		const inputs = subject.inputs();
		expect(inputs).toBeArrayOfSize(1);
		expect(inputs[0]).toBeInstanceOf(DTO.UnspentTransactionData);
		expect(inputs[0].id()).toBe("6bf76f4380da8a389ae0a7ecccf1922b74ae11d773ba8b1b761d84a1b4474a4f");
		expect(inputs[0].amount()).toEqual(BigNumber.make(30000000));
		expect(inputs[0].addresses()).toEqual([
			"addr_test1qrhvwtn8sa3duzkm93v5kjjxlv5lvg67j530wyeumngu23lk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33s4s8xvh",
		]);
	});

	it("#outputs", () => {
		const outputs = subject.outputs();
		expect(outputs).toBeArrayOfSize(2);
		expect(outputs[0]).toBeInstanceOf(DTO.UnspentTransactionData);
		expect(outputs[0].amount().toString()).toBe("25000000");
		expect(outputs[0].addresses()).toEqual([
			"addr_test1qzct2hsralem3fqn8fupu90v3jkelpg4rfp4zqx06zgevpachk6az8jcydma5a6vgsuw5c37v0c8j6rlclpqajn2vxsq3rz4th",
		]);
		expect(outputs[1]).toBeInstanceOf(DTO.UnspentTransactionData);
		expect(outputs[1].amount().toString()).toBe("4831199");
		expect(outputs[1].addresses()).toEqual([
			"addr_test1qzfjfm724nv9qz6nfyagmj0j2uppr35gzv5qee8s7489wxlk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33scc4thv",
		]);
	});

	it("#amount", () => {
		expect(subject.amount().toString()).toBe("25168801");
	});

	it("#fee", () => {
		expect(subject.fee().toString()).toBe("168801");
	});

	it("#asset", () => {
		expect(subject.asset()).toEqual({});
	});

	it("#isConfirmed", () => {
		expect(subject.isConfirmed()).toBeFalse();
	});

	it("#isSent", () => {
		expect(subject.isSent()).toBeTrue();
	});

	it("#isReceived", () => {
		expect(subject.isReceived()).toBeFalse();
	});

	it("#isTransfer", () => {
		expect(subject.isTransfer()).toBeFalse();
	});

	it("#isSecondSignature", () => {
		expect(subject.isSecondSignature()).toBeFalse();
	});

	it("#isDelegateRegistration", () => {
		expect(subject.isDelegateRegistration()).toBeFalse();
	});

	it("#isVoteCombination", () => {
		expect(subject.isVoteCombination()).toBeFalse();
	});

	it("#isVote", () => {
		expect(subject.isVote()).toBeFalse();
	});

	it("#isUnvote", () => {
		expect(subject.isUnvote()).toBeFalse();
	});

	it("#isMultiSignature", () => {
		expect(subject.isMultiSignature()).toBeFalse();
	});

	it("#isIpfs", () => {
		expect(subject.isIpfs()).toBeFalse();
	});

	it("#isMultiPayment", () => {
		expect(subject.isMultiPayment()).toBeFalse();
	});

	it("#isDelegateResignation", () => {
		expect(subject.isDelegateResignation()).toBeFalse();
	});

	it("#isHtlcLock", () => {
		expect(subject.isHtlcLock()).toBeFalse();
	});

	it("#isHtlcClaim", () => {
		expect(subject.isHtlcClaim()).toBeFalse();
	});

	it("#isHtlcRefund", () => {
		expect(subject.isHtlcRefund()).toBeFalse();
	});

	it("#isEntityRegistration", () => {
		expect(subject.isEntityRegistration()).toBeFalse();
	});

	it("#isEntityResignation", () => {
		expect(subject.isEntityResignation()).toBeFalse();
	});

	it("#isEntityUpdate", () => {
		expect(subject.isEntityUpdate()).toBeFalse();
	});

	it("#isBusinessEntityRegistration", () => {
		expect(subject.isBusinessEntityRegistration()).toBeFalse();
	});

	it("#isBusinessEntityResignation", () => {
		expect(subject.isBusinessEntityResignation()).toBeFalse();
	});

	it("#isBusinessEntityUpdate", () => {
		expect(subject.isBusinessEntityUpdate()).toBeFalse();
	});

	it("#isProductEntityRegistration", () => {
		expect(subject.isProductEntityRegistration()).toBeFalse();
	});

	it("#isProductEntityResignation", () => {
		expect(subject.isProductEntityResignation()).toBeFalse();
	});

	it("#isProductEntityUpdate", () => {
		expect(subject.isProductEntityUpdate()).toBeFalse();
	});

	it("#isPluginEntityRegistration", () => {
		expect(subject.isPluginEntityRegistration()).toBeFalse();
	});

	it("#isPluginEntityResignation", () => {
		expect(subject.isPluginEntityResignation()).toBeFalse();
	});

	it("#isPluginEntityUpdate", () => {
		expect(subject.isPluginEntityUpdate()).toBeFalse();
	});

	it("#isModuleEntityRegistration", () => {
		expect(subject.isModuleEntityRegistration()).toBeFalse();
	});

	it("#isModuleEntityResignation", () => {
		expect(subject.isModuleEntityResignation()).toBeFalse();
	});

	it("#isModuleEntityUpdate", () => {
		expect(subject.isModuleEntityUpdate()).toBeFalse();
	});

	it("#isDelegateEntityRegistration", () => {
		expect(subject.isDelegateEntityRegistration()).toBeFalse();
	});

	it("#isDelegateEntityResignation", () => {
		expect(subject.isDelegateEntityResignation()).toBeFalse();
	});

	it("#isDelegateEntityUpdate", () => {
		expect(subject.isDelegateEntityUpdate()).toBeFalse();
	});

	it("#isLegacyBusinessRegistration", () => {
		expect(subject.isLegacyBusinessRegistration()).toBeFalse();
	});

	it("#isLegacyBusinessResignation", () => {
		expect(subject.isLegacyBusinessResignation()).toBeFalse();
	});

	it("#isLegacyBusinessUpdate", () => {
		expect(subject.isLegacyBusinessUpdate()).toBeFalse();
	});

	it("#isLegacyBridgechainRegistration", () => {
		expect(subject.isLegacyBridgechainRegistration()).toBeFalse();
	});

	it("#isLegacyBridgechainResignation", () => {
		expect(subject.isLegacyBridgechainResignation()).toBeFalse();
	});

	it("#isLegacyBridgechainUpdate", () => {
		expect(subject.isLegacyBridgechainUpdate()).toBeFalse();
	});
});
