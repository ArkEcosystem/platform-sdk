import { Contracts, Exceptions, Utils } from "@arkecosystem/platform-sdk";
import Neon from "@cityofzion/neon-js";
import { api } from "@cityofzion/neon-js";

import { DelegateData, TransactionData, WalletData } from "../dto";

export class ClientService implements Contracts.ClientService {
	readonly #baseUrl: string;
	readonly #apiProvider;

	private constructor(opts: Contracts.KeyValuePair) {
		this.#baseUrl = {
			live: "https://api.neoscan.io/api/main_net/v1/",
			test: "https://neoscan-testnet.io/api/test_net/v1/",
		}[opts.network];

		this.#apiProvider = new api.neoscan.instance(opts.network === "live" ? "MainNet" : "TestNet");
	}

	public static async construct(opts: Contracts.KeyValuePair): Promise<ClientService> {
		return new ClientService(opts);
	}

	public async destruct(): Promise<void> {
		//
	}

	// get_transaction/{txid}
	public async transaction(id: string): Promise<Contracts.TransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "transaction");
	}

	public async transactions(
		query: Contracts.KeyValuePair,
	): Promise<Contracts.CollectionResponse<Contracts.TransactionData>> {
		const response = await this.get(`get_address_abstracts/${query.address}/${query.page || 1}`);

		return {
			meta: {
				pageCount: response.total_pages,
				totalCount: response.total_entries,
				count: response.page_size,
				current: response.page_number,
			},
			data: response.entries.map((transaction) => new TransactionData(transaction)),
		};
	}

	public async wallet(id: string): Promise<Contracts.WalletData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "wallet");
	}

	public async wallets(query: Contracts.KeyValuePair): Promise<Contracts.CollectionResponse<Contracts.WalletData>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "wallets");
	}

	public async delegate(id: string): Promise<Contracts.DelegateData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "delegate");
	}

	public async delegates(
		query?: Contracts.KeyValuePair,
	): Promise<Contracts.CollectionResponse<Contracts.DelegateData>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "delegates");
	}

	public async votes(id: string): Promise<Contracts.CollectionResponse<Contracts.TransactionData>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "votes");
	}

	public async voters(id: string): Promise<Contracts.CollectionResponse<Contracts.WalletData>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "voters");
	}

	public async syncing(): Promise<boolean> {
		throw new Exceptions.NotImplemented(this.constructor.name, "syncing");
	}

	public async broadcast(transactions: object[]): Promise<void> {
		for (const transaction of transactions) {
			const { response } = await Neon.sendAsset({
				api: this.#apiProvider,
				account: transaction["account"],
				intents: transaction["intents"],
			}); // response.txid
		}
	}

	private async get(path: string, query?: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		return Utils.getJSON(`${this.#baseUrl}${path}`, query);
	}

	private async post(path: string, body: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		return Utils.postJSON(this.#baseUrl, path, body);
	}
}
