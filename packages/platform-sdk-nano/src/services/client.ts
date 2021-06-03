import { Coins, Collections, Contracts, Helpers, Services } from "@arkecosystem/platform-sdk";

import { WalletData } from "../dto";
import * as TransactionDTO from "../dto";
import { NanoClient } from "./rpc";

export class ClientService extends Services.AbstractClientService {
	readonly #client: NanoClient;

	private constructor(config: Coins.Config) {
		super();

		this.#client = new NanoClient(config);
	}

	public static async __construct(config: Coins.Config): Promise<ClientService> {
		return new ClientService(config);
	}

	public async transactions(query: Services.ClientTransactionsInput): Promise<Collections.TransactionDataCollection> {
		const account = query.address || query.addresses![0];
		const count = (query.limit || 15).toString();
		const options = { head: query.cursor || undefined };
		const { history, previous } = await this.#client.accountHistory(account, count, options);

		return Helpers.createTransactionDataCollectionWithType(
			Object.values(history).map((transaction: any) => {
				transaction._origin = account;

				return transaction;
			}),
			{
				prev: undefined,
				self: undefined,
				next: previous,
				last: undefined,
			},
			TransactionDTO,
		);
	}

	public async wallet(id: string): Promise<Contracts.WalletData> {
		const { balance, pending } = await this.#client.accountInfo(id, { pending: true });

		return new WalletData({ id, balance, pending });
	}

	public async broadcast(transactions: Contracts.SignedTransactionData[]): Promise<Services.BroadcastResponse> {
		const result: Services.BroadcastResponse = {
			accepted: [],
			rejected: [],
			errors: {},
		};

		for (const transaction of transactions) {
			try {
				await this.#client.process("send", transaction.toBroadcast());

				result.accepted.push(transaction.id());
			} catch (error) {
				result.rejected.push(transaction.id());

				result.errors[transaction.id()] = error.message;
			}
		}

		return result;
	}
}
