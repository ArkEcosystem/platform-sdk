import { Coins, Contracts, DTO, Exceptions } from "@arkecosystem/platform-sdk";
import { Arr } from "@arkecosystem/platform-sdk-support";
import { createHash } from "crypto";
import { Api, JsonRpc } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import fetch from "node-fetch";
import { TextDecoder, TextEncoder } from "util";

export class TransactionService implements Contracts.TransactionService {
	readonly #networkId: string;
	readonly #peer: string;

	private constructor({ networkId, peer }) {
		this.#networkId = networkId;
		this.#peer = peer;
	}

	public static async construct(config: Coins.Config): Promise<TransactionService> {
		try {
			return new TransactionService({
				networkId: config.get<string>("network.crypto.networkId"),
				peer: config.get<string>("peer"),
			});
		} catch {
			return new TransactionService({
				networkId: config.get<string>("network.crypto.networkId"),
				peer: Arr.randomElement(config.get<Coins.CoinNetwork>("network").hosts),
			});
		}
	}

	public async destruct(): Promise<void> {
		//
	}

	public async transfer(
		input: Contracts.TransferInput,
		options?: Contracts.TransactionOptions,
	): Promise<DTO.SignedTransactionData> {
		const { client, signatureProvider } = this.getClient(input.sign.mnemonic);

		const transfer = await client.transact(
			{
				actions: [
					{
						account: "eosio.token",
						name: "transfer",
						authorization: [
							{
								actor: input.data.from,
								permission: "active",
							},
						],
						data: {
							from: input.data.from,
							to: input.data.to,
							quantity: "0.0001 TNT", // todo: use network specific token
							memo: input.data.memo,
						},
					},
				],
			},
			{
				blocksBehind: 3,
				expireSeconds: 30,
				broadcast: false,
				sign: false,
			},
		);

		const keys: string[] = await signatureProvider.getAvailableKeys();
		transfer.requiredKeys = keys;
		transfer.chainId = this.#networkId;

		const signatures = transfer.signatures || null;
		const transaction = await signatureProvider.sign(transfer);

		if (signatures) {
			transaction.signatures = transaction.signatures.concat(signatures);
		}

		return new DTO.SignedTransactionData(
			createHash("sha256").update(transaction.serializedTransaction).digest("hex"),
			transaction,
		);
	}

	public async secondSignature(
		input: Contracts.SecondSignatureInput,
		options?: Contracts.TransactionOptions,
	): Promise<DTO.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "secondSignature");
	}

	public async delegateRegistration(
		input: Contracts.DelegateRegistrationInput,
		options?: Contracts.TransactionOptions,
	): Promise<DTO.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "delegateRegistration");
	}

	public async vote(
		input: Contracts.VoteInput,
		options?: Contracts.TransactionOptions,
	): Promise<DTO.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "vote");
	}

	public async multiSignature(
		input: Contracts.MultiSignatureInput,
		options?: Contracts.TransactionOptions,
	): Promise<DTO.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "multiSignature");
	}

	public async ipfs(
		input: Contracts.IpfsInput,
		options?: Contracts.TransactionOptions,
	): Promise<DTO.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "ipfs");
	}

	public async multiPayment(
		input: Contracts.MultiPaymentInput,
		options?: Contracts.TransactionOptions,
	): Promise<DTO.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "multiPayment");
	}

	public async delegateResignation(
		input: Contracts.DelegateResignationInput,
		options?: Contracts.TransactionOptions,
	): Promise<DTO.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "delegateResignation");
	}

	public async htlcLock(
		input: Contracts.HtlcLockInput,
		options?: Contracts.TransactionOptions,
	): Promise<DTO.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "htlcLock");
	}

	public async htlcClaim(
		input: Contracts.HtlcClaimInput,
		options?: Contracts.TransactionOptions,
	): Promise<DTO.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "htlcClaim");
	}

	public async htlcRefund(
		input: Contracts.HtlcRefundInput,
		options?: Contracts.TransactionOptions,
	): Promise<DTO.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "htlcRefund");
	}

	public async entityRegistration(
		input: Contracts.EntityRegistrationInput,
		options?: Contracts.TransactionOptions,
	): Promise<DTO.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "entityRegistration");
	}

	public async entityResignation(
		input: Contracts.EntityResignationInput,
		options?: Contracts.TransactionOptions,
	): Promise<DTO.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "entityResignation");
	}

	public async entityUpdate(
		input: Contracts.EntityUpdateInput,
		options?: Contracts.TransactionOptions,
	): Promise<DTO.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "entityUpdate");
	}

	private getClient(privateKey: string) {
		const signatureProvider: JsSignatureProvider = new JsSignatureProvider([privateKey]);

		return {
			client: new Api({
				rpc: new JsonRpc(this.#peer, { fetch }),
				signatureProvider,
				// @ts-ignore - this started to error out of nowhere when building
				textEncoder: new TextEncoder(),
				// @ts-ignore - this started to error out of nowhere when building
				textDecoder: new TextDecoder(),
			}),
			signatureProvider,
		};
	}
}
