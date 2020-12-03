import { Coins, Contracts, DTO, Exceptions, Helpers } from "@arkecosystem/platform-sdk";
import { Arr } from "@arkecosystem/platform-sdk-support";

import { WalletData } from "../dto";
import * as TransactionDTO from "../dto";

export class ClientService implements Contracts.ClientService {
	readonly #http: Contracts.HttpClient;
	readonly #peer: string;

	readonly #broadcastErrors: Record<string, string> = {
		"Invalid sender publicKey": "ERR_INVALID_SENDER_PUBLICKEY",
		"Account does not have enough LSK": "ERR_INSUFFICIENT_FUNDS",
		"Sender does not have a secondPublicKey": "ERR_MISSING_SECOND_PUBLICKEY",
		"Missing signSignature": "ERR_MISSING_SIGNATURE",
		"Sender is not a multisignature account": "ERR_MISSING_MULTISIGNATURE",
	};

	private constructor({ http, peer }) {
		this.#http = http;
		this.#peer = peer;
	}

	public static async construct(config: Coins.Config): Promise<ClientService> {
		try {
			return new ClientService({
				http: config.get<Contracts.HttpClient>("httpClient"),
				peer: config.get<string>("peer"),
			});
		} catch {
			return new ClientService({
				http: config.get<Contracts.HttpClient>("httpClient"),
				peer: `${Arr.randomElement(config.get<string[]>("network.networking.hosts"))}/api`,
			});
		}
	}

	public async destruct(): Promise<void> {
		//
	}

	public async transaction(id: string): Promise<Contracts.TransactionData> {
		const result = await this.get("transactions", { id });

		return Helpers.createTransactionDataWithType(result.data[0], TransactionDTO);
	}

	public async transactions(query: Contracts.ClientTransactionsInput): Promise<Coins.TransactionDataCollection> {
		// @ts-ignore
		const result = await this.get("transactions", this.createSearchParams({ sort: "timestamp:desc", ...query }));

		return Helpers.createTransactionDataCollectionWithType(
			result.data,
			this.createPagination(result.data, result.meta),
			TransactionDTO,
		);
	}

	public async wallet(id: string): Promise<Contracts.WalletData> {
		const result = await this.get("accounts", { address: id });

		return new WalletData(result.data[0]);
	}

	public async wallets(query: Contracts.ClientWalletsInput): Promise<Coins.WalletDataCollection> {
		const result = await this.get("accounts", query);

		return new Coins.WalletDataCollection(
			result.data.map((wallet) => new WalletData(wallet)),
			this.createPagination(result.data, result.meta),
		);
	}

	public async delegate(id: string): Promise<Contracts.WalletData> {
		const result = await this.get("delegates", { username: id });

		return new WalletData(result.data[0]);
	}

	public async delegates(query?: any): Promise<Coins.WalletDataCollection> {
		const result = await this.get("delegates", this.createSearchParams({ limit: 101, ...query }));

		return new Coins.WalletDataCollection(
			result.data.map((wallet) => new WalletData(wallet)),
			this.createPagination(result.data, result.meta),
		);
	}

	public async votes(id: string): Promise<Contracts.VoteReport> {
		const { data } = await this.get("votes", { address: id, limit: 101 });

		return {
			used: data.votesUsed,
			available: data.votesAvailable,
			publicKeys: data.votes.map((vote: { publicKey: string }) => vote.publicKey),
		};
	}

	public async voters(id: string, query?: Contracts.KeyValuePair): Promise<Coins.WalletDataCollection> {
		throw new Exceptions.NotImplemented(this.constructor.name, "voters");
	}

	public async syncing(): Promise<boolean> {
		throw new Exceptions.NotImplemented(this.constructor.name, "syncing");
	}

	public async broadcast(transactions: Contracts.SignedTransactionData[]): Promise<Contracts.BroadcastResponse> {
		const result: Contracts.BroadcastResponse = {
			accepted: [],
			rejected: [],
			errors: {},
		};

		for (const transaction of transactions) {
			const { data, errors } = await this.post("transactions", transaction.data());

			if (data) {
				result.accepted.push(transaction.id());
			}

			if (errors) {
				result.rejected.push(transaction.id());

				if (!Array.isArray(result.errors[transaction.id()])) {
					result.errors[transaction.id()] = [];
				}

				for (const [key, value] of Object.entries(this.#broadcastErrors)) {
					if (errors[0].message.includes(key)) {
						result.errors[transaction.id()].push(value);
					}
				}
			}
		}

		return result;
	}

	public async broadcastSpread(
		transactions: Contracts.SignedTransactionData[],
		hosts: string[],
	): Promise<Contracts.BroadcastResponse> {
		throw new Exceptions.NotImplemented(this.constructor.name, "broadcastSpread");
	}

	public async entityHistory(id: string, query?: Contracts.KeyValuePair): Promise<Coins.TransactionDataCollection> {
		throw new Exceptions.NotImplemented(this.constructor.name, "entityHistory");
	}

	private async get(path: string, query?: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		const response = await this.#http.get(`${this.#peer}/${path}`, query);

		return response.json();
	}

	private async post(path: string, body: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		const response = await this.#http.post(`${this.#peer}/${path}`, body);

		return response.json();
	}

	private createSearchParams(searchParams: Contracts.ClientTransactionsInput): object {
		if (!searchParams) {
			searchParams = {};
		}

		if (searchParams.cursor) {
			// @ts-ignore
			searchParams.offset = searchParams.cursor - 1;
			delete searchParams.cursor;
		}

		// What is used as "address" with ARK is "senderIdOrRecipientId" with LSK.
		if (searchParams.address) {
			// @ts-ignore - This field doesn't exist on the interface but are needed.
			searchParams.senderIdOrRecipientId = searchParams.address;
			delete searchParams.address;
		}

		// LSK doesn't support bulk lookups so we will simply use the first address.
		if (searchParams.addresses) {
			// @ts-ignore - This field doesn't exist on the interface but are needed.
			searchParams.senderIdOrRecipientId = searchParams.addresses[0];
			delete searchParams.addresses;
		}

		return searchParams;
	}

	private createPagination(data, meta): Contracts.MetaPagination {
		const hasPreviousPage: boolean = data && data.length === meta.limit && meta.offset !== 0;
		const hasNextPage: boolean = data && data.length === meta.limit;

		return {
			prev: hasPreviousPage ? Number(meta.offset) - Number(meta.limit) : undefined,
			self: meta.offset,
			next: hasNextPage ? Number(meta.offset) + Number(meta.limit) : undefined,
		};
	}
}
