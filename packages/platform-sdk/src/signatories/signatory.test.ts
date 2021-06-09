import "jest-extended";

import { LedgerSignatory } from "./ledger";
import { MnemonicSignatory } from "./mnemonic";
import { MultiMnemonicSignatory } from "./multi-mnemonic";
import { MultiSignatureSignatory } from "./multi-signature";
import { PrivateKeySignatory } from "./private-key";
import { PrivateMultiSignatureSignatory } from "./private-multi-signature";
import { SecondaryMnemonicSignatory } from "./secondary-mnemonic";
import { SecondaryWIFSignatory } from "./secondary-wif";
import { SenderPublicKeySignatory } from "./sender-public-key";
import { Signatory } from "./signatory";
import { WIFSignatory } from "./wif";

describe("MnemonicSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
	});

	test("#signingKeys", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.signingKeys()).toThrow(/cannot be called/);
	});

	test("#signingList", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.signingList()).toThrow(/cannot be called/);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.confirmKey()).toThrow(/cannot be called/);
	});

	test("#identifier", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.identifier()).toThrow(/cannot be called/);
	});

	test("#identifiers", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.identifiers()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.address()).toMatchInlineSnapshot(`"address"`);
	});

	test("#publicKey", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.publicKey()).toMatchInlineSnapshot(`"publicKey"`);
	});

	test("#privateKey", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.privateKey()).toMatchInlineSnapshot(`"privateKey"`);
	});
});

describe("MultiMnemonicSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(() => subject.signingKey()).toThrow(/cannot be called/);
	});

	test("#signingKeys", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(subject.signingKeys()).toMatchInlineSnapshot(`
		Array [
		  "signingKey",
		]
	`);
	});

	test("#signingList", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(() => subject.signingList()).toThrow(/cannot be called/);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(() => subject.confirmKey()).toThrow(/cannot be called/);
	});

	test("#identifier", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(() => subject.identifier()).toThrow(/cannot be called/);
	});

	test("#identifiers", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(subject.identifiers()).toMatchInlineSnapshot(`
		Array [
		  "identifier",
		]
	`);
	});

	test("#address", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(() => subject.address()).toThrow(/cannot be called/);
	});

	test("#publicKey", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(() => subject.publicKey()).toThrow(/cannot be called/);
	});

	test("#privateKey", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(() => subject.privateKey()).toThrow(/cannot be called/);
	});
});

describe("SecondaryMnemonicSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new SecondaryMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
	});

	test("#signingKeys", () => {
		const subject = new Signatory(
			new SecondaryMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.signingKeys()).toThrow(/cannot be called/);
	});

	test("#signingList", () => {
		const subject = new Signatory(
			new SecondaryMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.signingList()).toThrow(/cannot be called/);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new SecondaryMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.confirmKey()).toMatchInlineSnapshot(`"confirmKey"`);
	});

	test("#identifier", () => {
		const subject = new Signatory(
			new SecondaryMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.identifier()).toThrow(/cannot be called/);
	});

	test("#identifiers", () => {
		const subject = new Signatory(
			new SecondaryMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.identifiers()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new SecondaryMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.address()).toMatchInlineSnapshot(`"address"`);
	});

	test("#publicKey", () => {
		const subject = new Signatory(
			new SecondaryMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.publicKey()).toMatchInlineSnapshot(`"publicKey"`);
	});

	test("#privateKey", () => {
		const subject = new Signatory(
			new SecondaryMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.privateKey()).toMatchInlineSnapshot(`"privateKey"`);
	});
});

describe("WIFSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
	});

	test("#signingKeys", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.signingKeys()).toThrow(/cannot be called/);
	});

	test("#signingList", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.signingList()).toThrow(/cannot be called/);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.confirmKey()).toThrow(/cannot be called/);
	});

	test("#identifier", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.identifier()).toThrow(/cannot be called/);
	});

	test("#identifiers", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.identifiers()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.address()).toMatchInlineSnapshot(`"address"`);
	});

	test("#publicKey", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.publicKey()).toMatchInlineSnapshot(`"publicKey"`);
	});

	test("#privateKey", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.privateKey()).toMatchInlineSnapshot(`"privateKey"`);
	});
});

describe("SecondaryWIFSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new SecondaryWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
	});

	test("#signingKeys", () => {
		const subject = new Signatory(
			new SecondaryWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.signingKeys()).toThrow(/cannot be called/);
	});

	test("#signingList", () => {
		const subject = new Signatory(
			new SecondaryWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.signingList()).toThrow(/cannot be called/);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new SecondaryWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.confirmKey()).toMatchInlineSnapshot(`"confirmKey"`);
	});

	test("#identifier", () => {
		const subject = new Signatory(
			new SecondaryWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.identifier()).toThrow(/cannot be called/);
	});

	test("#identifiers", () => {
		const subject = new Signatory(
			new SecondaryWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.identifiers()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new SecondaryWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.address()).toMatchInlineSnapshot(`"address"`);
	});

	test("#publicKey", () => {
		const subject = new Signatory(
			new SecondaryWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.publicKey()).toMatchInlineSnapshot(`"publicKey"`);
	});

	test("#privateKey", () => {
		const subject = new Signatory(
			new SecondaryWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.privateKey()).toMatchInlineSnapshot(`"privateKey"`);
	});
});

describe("PrivateKeySignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
	});

	test("#signingKeys", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(() => subject.signingKeys()).toThrow(/cannot be called/);
	});

	test("#signingList", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(() => subject.signingList()).toThrow(/cannot be called/);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(() => subject.confirmKey()).toThrow(/cannot be called/);
	});

	test("#identifier", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(() => subject.identifier()).toThrow(/cannot be called/);
	});

	test("#identifiers", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(() => subject.identifiers()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(subject.address()).toMatchInlineSnapshot(`"address"`);
	});

	test("#publicKey", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(() => subject.publicKey()).toThrow(/cannot be called/);
	});

	test("#privateKey", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(subject.privateKey()).toMatchInlineSnapshot(`"signingKey"`);
	});
});

describe("SenderPublicKeySignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
	});

	test("#signingKeys", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(() => subject.signingKeys()).toThrow(/cannot be called/);
	});

	test("#signingList", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(() => subject.signingList()).toThrow(/cannot be called/);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(() => subject.confirmKey()).toThrow(/cannot be called/);
	});

	test("#identifier", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(() => subject.identifier()).toThrow(/cannot be called/);
	});

	test("#identifiers", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(() => subject.identifiers()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(subject.address()).toMatchInlineSnapshot(`"address"`);
	});

	test("#publicKey", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(subject.publicKey()).toMatchInlineSnapshot(`"publicKey"`);
	});

	test("#privateKey", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(() => subject.privateKey()).toThrow(/cannot be called/);
	});
});

describe("MultiSignatureSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(() => subject.signingKey()).toThrow(/cannot be called/);
	});

	test("#signingKeys", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(() => subject.signingKeys()).toThrow(/cannot be called/);
	});

	test("#signingList", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(subject.signingList()).toMatchInlineSnapshot(`
		Object {
		  "min": 5,
		  "publicKeys": Array [
		    "identifier",
		  ],
		}
	`);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(() => subject.confirmKey()).toThrow(/cannot be called/);
	});

	test("#identifier", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(subject.identifier()).toMatchInlineSnapshot(`"identifier"`);
	});

	test("#identifiers", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(() => subject.identifiers()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(() => subject.address()).toThrow(/cannot be called/);
	});

	test("#publicKey", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(() => subject.publicKey()).toThrow(/cannot be called/);
	});

	test("#privateKey", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(() => subject.privateKey()).toThrow(/cannot be called/);
	});
});

describe("PrivateMultiSignatureSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(subject.signingKey()).toMatchInlineSnapshot(`"this is a top secret passphrase 1"`);
	});

	test("#signingKeys", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(subject.signingKeys()).toMatchInlineSnapshot(`
		Array [
		  "this is a top secret passphrase 1",
		  "this is a top secret passphrase 2",
		]
	`);
	});

	test("#signingList", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(() => subject.confirmKey()).toThrow(/cannot be called/);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(() => subject.confirmKey()).toThrow(/cannot be called/);
	});

	test("#identifier", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(() => subject.identifier()).toThrow(/cannot be called/);
	});

	test("#identifiers", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(() => subject.identifiers()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(() => subject.address()).toThrow(/cannot be called/);
	});

	test("#publicKey", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(() => subject.publicKey()).toThrow(/cannot be called/);
	});

	test("#privateKey", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(() => subject.privateKey()).toThrow(/cannot be called/);
	});
});

test("#actsWithMnemonic", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithMnemonic()).toBeBoolean();
});

test("#actsWithMultiMnemonic", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithMultiMnemonic()).toBeBoolean();
});

test("#actsWithSecondaryMnemonic", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithSecondaryMnemonic()).toBeBoolean();
});

test("#actsWithWif", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithWif()).toBeBoolean();
});

test("#actsWithSecondaryWif", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithSecondaryWif()).toBeBoolean();
});

test("#actsWithPrivateKey", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithPrivateKey()).toBeBoolean();
});

test("#actsWithSenderPublicKey", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithSenderPublicKey()).toBeBoolean();
});

test("#actsWithMultiSignature", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithMultiSignature()).toBeBoolean();
});

test("#actsWithPrivateMultiSignature", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithPrivateMultiSignature()).toBeBoolean();
});

test("#actsWithLedger", () => {
	const subject = new Signatory(new LedgerSignatory("path"));

	expect(subject.actsWithLedger()).toBeBoolean();
});
