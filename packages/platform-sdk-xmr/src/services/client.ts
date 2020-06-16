import { Coins, Contracts, Exceptions } from "@arkecosystem/platform-sdk";
import { Arr } from "@arkecosystem/platform-sdk-support";

export class ClientService implements Contracts.ClientService {
	readonly #http: Contracts.HttpClient;
	readonly #peer: string;

	private constructor({ http, peer }) {
		this.#http = http;
		this.#peer = `${peer}/api`;
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
				peer: Arr.randomElement(config.get<Coins.CoinNetwork>("network").hosts),
			});
		}
	}

	public async destruct(): Promise<void> {
		//
	}

	public async transaction(id: string): Promise<Contracts.TransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "transaction");
	}

	public async transactions(
		query: Contracts.ClientTransactionsInput,
	): Promise<Contracts.CollectionResponse<Coins.TransactionDataCollection>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "transactions");
	}

	public async wallet(id: string): Promise<Contracts.WalletData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "wallet");
	}

	public async wallets(
		query: Contracts.ClientWalletsInput,
	): Promise<Contracts.CollectionResponse<Coins.WalletDataCollection>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "wallets");
	}

	public async delegate(id: string): Promise<Contracts.DelegateData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "delegate");
	}

	public async delegates(
		query?: Contracts.KeyValuePair,
	): Promise<Contracts.CollectionResponse<Coins.DelegateDataCollection>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "delegates");
	}

	public async votes(
		id: string,
		query?: Contracts.KeyValuePair,
	): Promise<Contracts.CollectionResponse<Coins.TransactionDataCollection>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "votes");
	}

	public async voters(
		id: string,
		query?: Contracts.KeyValuePair,
	): Promise<Contracts.CollectionResponse<Coins.WalletDataCollection>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "voters");
	}

	public async syncing(): Promise<boolean> {
		throw new Exceptions.NotImplemented(this.constructor.name, "syncing");
	}

	public async broadcast(transactions: Contracts.SignedTransaction[]): Promise<Contracts.BroadcastResponse> {
		throw new Exceptions.NotImplemented(this.constructor.name, "broadcast");
	}

	private async get(path: string, query?: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		return this.#http.get(`${this.#peer}/${path}`, query);
	}

	private async post(path: string, body: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		return this.#http.post(`${this.#peer}/${path}`, body);
	}
}
