import { Coins, Contracts, Exceptions, Helpers, Services } from "@arkecosystem/platform-sdk";
import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { createHash } from "crypto";
import { Api, JsonRpc } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import fetch from "node-fetch";
import { TextDecoder, TextEncoder } from "util";

import { SignedTransactionData } from "../dto";

export class TransactionService extends Services.AbstractTransactionService {
	readonly #networkId: string;
	readonly #peer: string;

	private constructor({ networkId, peer }) {
		super();

		this.#networkId = networkId;
		this.#peer = peer;
	}

	public static async __construct(config: Coins.Config): Promise<TransactionService> {
		return new TransactionService({
			networkId: config.get<string>("network.meta.networkId"),
			peer: Helpers.randomHostFromConfig(config, "full").host,
		});
	}

	public async transfer(
		input: Contracts.TransferInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		try {
			if (input.signatory.signingKey() === undefined) {
				throw new Error("No mnemonic provided.");
			}

			const { client, signatureProvider } = this.getClient(input.signatory.signingKey());

			const transfer = await client.transact(
				{
					actions: [
						{
							account: "eosio.token",
							name: "transfer",
							authorization: [
								{
									actor: input.signatory.address(),
									permission: "active",
								},
							],
							data: {
								from: input.signatory.address(),
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

			return new SignedTransactionData(
				createHash("sha256").update(transaction.serializedTransaction).digest("hex"),
				{ ...transaction, timestamp: DateTime.make() },
				transaction,
			);
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
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
