import "jest-extended";

import { ARK } from "@arkecosystem/platform-sdk-ark";

import { FeatureFlag } from "./enums";
import { Network } from "./network";

let subject: Network;

beforeEach(() => {
	subject = new Network("ARK", ARK.manifest.networks["ark.devnet"]);
});

it("should have an coin", () => {
	expect(subject.coin()).toBe("ARK");
});

it("should have an id", () => {
	expect(subject.id()).toBe("ark.devnet");
});

it("should have a name", () => {
	expect(subject.name()).toBe("ARK Devnet");
});

it("should have an explorer", () => {
	expect(subject.explorer()).toBe("https://dexplorer.ark.io/");
});

it("should have a ticker", () => {
	expect(subject.ticker()).toBe("DARK");
});

it("should have a symbol", () => {
	expect(subject.symbol()).toBe("DѦ");
});

it("should determine if the network is a live environment", () => {
	expect(subject.isLive()).toBeFalse();
});

it("should determine if the network is a test environment", () => {
	expect(subject.isTest()).toBeTrue();
});

it("should allows voting", () => {
	expect(subject.allowsVoting()).toBeTrue();
});

it("should maximum votes per wallet", () => {
	expect(subject.maximumVotesPerWallet()).toBe(1);
});

it("should maximum votes per transaction", () => {
	expect(subject.maximumVotesPerTransaction()).toBe(1);
});

it("should have an object representation", () => {
	expect(subject.toObject()).toMatchInlineSnapshot(`
		Object {
		  "crypto": Object {
		    "signingMethods": Object {
		      "mnemonic": true,
		      "privateKey": false,
		      "wif": true,
		    },
		    "slip44": 1,
		  },
		  "currency": Object {
		    "symbol": "DѦ",
		    "ticker": "DARK",
		  },
		  "explorer": "https://dexplorer.ark.io/",
		  "featureFlags": Object {
		    "Client": Object {
		      "broadcast": true,
		      "configuration": true,
		      "delegate": true,
		      "delegates": true,
		      "fees": true,
		      "syncing": true,
		      "transaction": true,
		      "transactions": true,
		      "voters": true,
		      "votes": true,
		      "wallet": true,
		      "wallets": true,
		    },
		    "Fee": Object {
		      "all": true,
		    },
		    "Identity": Object {
		      "address": Object {
		        "mnemonic": true,
		        "multiSignature": true,
		        "privateKey": true,
		        "publicKey": true,
		        "wif": true,
		      },
		      "keyPair": Object {
		        "mnemonic": true,
		        "privateKey": false,
		        "wif": true,
		      },
		      "privateKey": Object {
		        "mnemonic": true,
		        "wif": true,
		      },
		      "publicKey": Object {
		        "mnemonic": true,
		        "multiSignature": true,
		        "wif": true,
		      },
		      "wif": Object {
		        "mnemonic": true,
		      },
		    },
		    "Ledger": Object {
		      "getPublicKey": true,
		      "getVersion": true,
		      "signMessage": true,
		      "signTransaction": true,
		    },
		    "Link": Object {
		      "block": true,
		      "transaction": true,
		      "wallet": true,
		    },
		    "Message": Object {
		      "sign": true,
		      "verify": true,
		    },
		    "Peer": Object {
		      "search": true,
		    },
		    "Transaction": Object {
		      "delegateRegistration": true,
		      "delegateResignation": true,
		      "entityRegistration": true,
		      "entityResignation": true,
		      "entityUpdate": true,
		      "htlcClaim": true,
		      "htlcLock": true,
		      "htlcRefund": true,
		      "ipfs": true,
		      "multiPayment": true,
		      "multiSignature": true,
		      "secondSignature": true,
		      "transfer": true,
		      "vote": true,
		    },
		  },
		  "governance": Object {
		    "voting": Object {
		      "enabled": true,
		      "maximumPerTransaction": 1,
		      "maximumPerWallet": 1,
		    },
		  },
		  "id": "ark.devnet",
		  "knownWallets": "https://raw.githubusercontent.com/ArkEcosystem/common/master/devnet/known-wallets-extended.json",
		  "name": "ARK Devnet",
		  "networking": Object {
		    "hosts": Array [
		      "https://dwallets.ark.io",
		    ],
		    "hostsMultiSignature": Array [
		      "https://dmusig1.ark.io",
		    ],
		  },
		  "type": "test",
		}
	`);
});

it("should have an string representation", () => {
	expect(subject.toJson()).toMatchInlineSnapshot(
		`"{\\"id\\":\\"ark.devnet\\",\\"type\\":\\"test\\",\\"name\\":\\"ARK Devnet\\",\\"explorer\\":\\"https://dexplorer.ark.io/\\",\\"currency\\":{\\"ticker\\":\\"DARK\\",\\"symbol\\":\\"DѦ\\"},\\"crypto\\":{\\"slip44\\":1,\\"signingMethods\\":{\\"mnemonic\\":true,\\"privateKey\\":false,\\"wif\\":true}},\\"networking\\":{\\"hosts\\":[\\"https://dwallets.ark.io\\"],\\"hostsMultiSignature\\":[\\"https://dmusig1.ark.io\\"]},\\"governance\\":{\\"voting\\":{\\"enabled\\":true,\\"maximumPerWallet\\":1,\\"maximumPerTransaction\\":1}},\\"featureFlags\\":{\\"Client\\":{\\"transaction\\":true,\\"transactions\\":true,\\"wallet\\":true,\\"wallets\\":true,\\"delegate\\":true,\\"delegates\\":true,\\"votes\\":true,\\"voters\\":true,\\"configuration\\":true,\\"fees\\":true,\\"syncing\\":true,\\"broadcast\\":true},\\"Fee\\":{\\"all\\":true},\\"Identity\\":{\\"address\\":{\\"mnemonic\\":true,\\"multiSignature\\":true,\\"publicKey\\":true,\\"privateKey\\":true,\\"wif\\":true},\\"publicKey\\":{\\"mnemonic\\":true,\\"multiSignature\\":true,\\"wif\\":true},\\"privateKey\\":{\\"mnemonic\\":true,\\"wif\\":true},\\"wif\\":{\\"mnemonic\\":true},\\"keyPair\\":{\\"mnemonic\\":true,\\"privateKey\\":false,\\"wif\\":true}},\\"Ledger\\":{\\"getVersion\\":true,\\"getPublicKey\\":true,\\"signTransaction\\":true,\\"signMessage\\":true},\\"Link\\":{\\"block\\":true,\\"transaction\\":true,\\"wallet\\":true},\\"Message\\":{\\"sign\\":true,\\"verify\\":true},\\"Peer\\":{\\"search\\":true},\\"Transaction\\":{\\"transfer\\":true,\\"secondSignature\\":true,\\"delegateRegistration\\":true,\\"vote\\":true,\\"multiSignature\\":true,\\"ipfs\\":true,\\"multiPayment\\":true,\\"delegateResignation\\":true,\\"htlcLock\\":true,\\"htlcClaim\\":true,\\"htlcRefund\\":true,\\"entityRegistration\\":true,\\"entityResignation\\":true,\\"entityUpdate\\":true}},\\"knownWallets\\":\\"https://raw.githubusercontent.com/ArkEcosystem/common/master/devnet/known-wallets-extended.json\\"}"`,
	);
});

it("#can", () => {
	expect(subject.can(FeatureFlag.ClientBroadcast)).toBeTrue();
	expect(subject.can(FeatureFlag.IdentityKeyPairPrivateKey)).toBeFalse();
});

it("#cannot", () => {
	expect(subject.cannot(FeatureFlag.IdentityKeyPairPrivateKey)).toBeTrue();
	expect(subject.cannot(FeatureFlag.ClientBroadcast)).toBeFalse();
});

it("#accessible", () => {
	expect(() => subject.accessible(FeatureFlag.ClientBroadcast)).not.toThrow(
		"The [Identity.keyPair.privateKey] feature flag is not accessible.",
	);
	expect(() => subject.accessible(FeatureFlag.IdentityKeyPairPrivateKey)).toThrow(
		"The [Identity.keyPair.privateKey] feature flag is not accessible.",
	);
});
