import "jest-extended";

import { IoC, Signatories } from "@arkecosystem/platform-sdk";

import { identity } from "../../test/fixtures/identity";
import { createService } from "../../test/helpers";
import { AddressService } from "./address";
import { DataTransferObjectService } from "./data-transfer-object";
import { KeyPairService } from "./key-pair";
import { PublicKeyService } from "./public-key";
import { TransactionService } from "./transaction";

let subject: TransactionService;

beforeAll(async () => {
	subject = createService(TransactionService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.DataTransferObjectService, DataTransferObjectService);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
	});
});

describe("TransactionService", () => {
	describe("#transfer", () => {
		it.each(["lsk.mainnet", "lsk.testnet"])("should create for %s", async (network) => {
			const service = createService(TransactionService, network, (container) => {
				container.constant(IoC.BindingType.Container, container);
				container.singleton(IoC.BindingType.AddressService, AddressService);
				container.singleton(IoC.BindingType.DataTransferObjectService, DataTransferObjectService);
				container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
				container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
			});

			const result = await service.transfer({
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: identity.mnemonic,
						address: "15957226662510576840L",
						publicKey: "publicKey",
						privateKey: "privateKey",
					}),
				),
				data: {
					amount: 1,
					to: identity.address,
				},
			});

			expect(result).toBeObject();
		});
	});

	describe("#secondSignature", () => {
		it("should verify", async () => {
			const result = await subject.secondSignature({
				signatory: new Signatories.Signatory(
					new Signatories.SecondaryMnemonicSignatory({
						signingKey: identity.mnemonic,
						confirmKey: identity.mnemonic,
						address: "15957226662510576840L",
						publicKey: "publicKey",
						privateKey: "privateKey",
					}),
				),
				data: {
					mnemonic: identity.mnemonic,
				},
			});

			expect(result).toBeObject();
		});
	});

	describe("#delegateRegistration", () => {
		it("should verify", async () => {
			const result = await subject.delegateRegistration({
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: identity.mnemonic,
						address: "15957226662510576840L",
						publicKey: "publicKey",
						privateKey: "privateKey",
					}),
				),
				data: {
					username: "johndoe",
				},
			});

			expect(result).toBeObject();
		});
	});

	describe("#vote", () => {
		it("should verify", async () => {
			const result = await subject.vote({
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: identity.mnemonic,
						address: "15957226662510576840L",
						publicKey: "publicKey",
						privateKey: "privateKey",
					}),
				),
				data: {
					votes: ["9d3058175acab969f41ad9b86f7a2926c74258670fe56b37c429c01fca9f2f0f"],
					unvotes: [],
				},
			});

			expect(result).toBeObject();
		});
	});

	describe("#multiSignature", () => {
		it("should verify", async () => {
			const result = await subject.multiSignature({
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: identity.mnemonic,
						address: "15957226662510576840L",
						publicKey: "publicKey",
						privateKey: "privateKey",
					}),
				),
				data: {
					publicKeys: [
						"9d3058175acab969f41ad9b86f7a2926c74258670fe56b37c429c01fca9f2f0f",
						"141b16ac8d5bd150f16b1caa08f689057ca4c4434445e56661831f4e671b7c0a",
						"3ff32442bb6da7d60c1b7752b24e6467813c9b698e0f278d48c43580da972135",
					],
					lifetime: 34,
					min: 2,
				},
			});

			expect(result).toBeObject();
		});
	});
});
