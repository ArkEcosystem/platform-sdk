import { Coins, Contracts, Helpers, Services } from "@arkecosystem/platform-sdk";

import { WalletData } from "../dto";
import * as TransactionDTO from "../dto";

export class ClientService extends Services.AbstractClientService {
	readonly #http: Contracts.HttpClient;
	readonly #peer: string;

	readonly #broadcastErrors: Record<string, string> = {
		"bad-txns-inputs-duplicate": "ERR_INPUTS_DUPLICATE",
		"bad-txns-in-belowout": "ERR_IN_BELOWOUT",
		"bad-txns-vout-negative": "ERR_VOUT_NEGATIVE",
		"bad-txns-vout-toolarge": "ERR_VOUT_TOOLARGE",
		"bad-txns-txouttotal-toolarge": "ERR_TXOUTTOTAL_TOOLARGE",
	};

	private constructor({ http, peer }) {
		super();

		this.#http = http;
		this.#peer = peer;
	}

	public static async __construct(config: Coins.Config): Promise<ClientService> {
		return new ClientService({
			http: config.get<Contracts.HttpClient>(Coins.ConfigKey.HttpClient),
			peer: Helpers.randomHostFromConfig(config),
		});
	}

	public async transaction(
		id: string,
		input?: Contracts.TransactionDetailInput,
	): Promise<Contracts.TransactionDataType> {
		return Helpers.createTransactionDataWithType(await this.get(`transactions/${id}`), TransactionDTO);
	}

	public async wallet(id: string): Promise<Contracts.WalletData> {
		return new WalletData(await this.get(`wallets/${id}`));
	}

	public async broadcast(transactions: Contracts.SignedTransactionData[]): Promise<Contracts.BroadcastResponse> {
		const result: Contracts.BroadcastResponse = {
			accepted: [],
			rejected: [],
			errors: {},
		};

		for (const transaction of transactions) {
			const transactionId: string = transaction.id(); // todo: get the transaction ID

			if (!transactionId) {
				throw new Error("Failed to compute the transaction ID.");
			}

			const response = await this.post("transactions", { transactions: [transaction.toBroadcast()] });

			if (response.result) {
				result.accepted.push(transactionId);
			}

			if (response.error) {
				result.rejected.push(transactionId);

				if (!Array.isArray(result.errors[transactionId])) {
					result.errors[transactionId] = [];
				}

				for (const [key, value] of Object.entries(this.#broadcastErrors)) {
					if (response.error.message.includes(key)) {
						result.errors[transactionId].push(value);
					}
				}
			}
		}

		return result;
	}

	private async get(path: string, query?: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		const response = await this.#http.get(`${this.#peer}/${path}`, query);

		return response.json();
	}

	private async post(path: string, body: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		const response = await this.#http.post(`${this.#peer}/${path}`, body);

		return response.json();
	}
}
