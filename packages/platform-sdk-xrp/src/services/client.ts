import { Coins, Contracts, Helpers, Services } from "@arkecosystem/platform-sdk";
import { UUID } from "@arkecosystem/platform-sdk-crypto";
import { HttpClient } from "@arkecosystem/platform-sdk-http";

import { WalletData } from "../dto";
import * as TransactionDTO from "../dto";
import { broadcastErrors } from "./client.helpers";

export class ClientService extends Services.AbstractClientService {
	readonly #config: Coins.Config;
	readonly #http: HttpClient;

	private constructor(config: Coins.Config) {
		super();

		this.#config = config;
		this.#http = config.get<HttpClient>(Coins.ConfigKey.HttpClient);
	}

	public static async __construct(config: Coins.Config): Promise<ClientService> {
		return new ClientService(config);
	}

	public async transaction(
		id: string,
		input?: Services.TransactionDetailInput,
	): Promise<Contracts.TransactionDataType> {
		const transaction = await this.#post("tx", [
			{
				transaction: id,
				binary: false,
			},
		]);

		return Helpers.createTransactionDataWithType(transaction, TransactionDTO);
	}

	public async transactions(query: Services.ClientTransactionsInput): Promise<Coins.TransactionDataCollection> {
		const { transactions } = await this.#post("account_tx", [
			{
				account: query.address || query.addresses![0],
				limit: query.limit || 15,
			},
		]);

		return Helpers.createTransactionDataCollectionWithType(
			transactions.map(({ tx }) => tx),
			{
				prev: undefined,
				self: undefined,
				next: undefined,
				last: undefined,
			},
			TransactionDTO,
		);
	}

	public async wallet(id: string): Promise<Contracts.WalletData> {
		return new WalletData(
			(
				await this.#post("account_info", [
					{
						account: id,
						strict: true,
						ledger_index: "current",
					},
				])
			).account_data,
		);
	}

	public async broadcast(transactions: Contracts.SignedTransactionData[]): Promise<Services.BroadcastResponse> {
		const result: Services.BroadcastResponse = {
			accepted: [],
			rejected: [],
			errors: {},
		};

		for (const transaction of transactions) {
			const { engine_result, tx_json } = await this.#post("submit", [
				{
					tx_blob: transaction.toBroadcast(),
				},
			]);

			const transactionId: string = tx_json.hash;

			transaction.setAttributes({ identifier: transactionId });

			if (engine_result === "tesSUCCESS") {
				result.accepted.push(transactionId);
			} else {
				result.rejected.push(transactionId);

				if (!Array.isArray(result.errors[transactionId])) {
					result.errors[transactionId] = [];
				}

				result.errors[transactionId].push(broadcastErrors[engine_result]);
			}
		}

		return result;
	}

	async #post(method: string, params: any[]): Promise<Contracts.KeyValuePair> {
		return (
			await this.#http.post(Helpers.randomHostFromConfig(this.#config), {
				jsonrpc: "2.0",
				id: UUID.random(),
				method,
				params,
			})
		).json().result;
	}
}
