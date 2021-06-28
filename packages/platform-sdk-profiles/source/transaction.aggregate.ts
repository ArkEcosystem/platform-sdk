import { Collections, Services } from "@arkecosystem/platform-sdk";
import { IProfile, IReadWriteWallet, ITransactionAggregate } from "./contracts";
import { ExtendedConfirmedTransactionDataCollection } from "./transaction.collection";

import { ExtendedConfirmedTransactionData } from "./transaction.dto";
import { promiseAllSettledByKey } from "./helpers/promise";

type HistoryMethod = string;
type HistoryWallet = ExtendedConfirmedTransactionDataCollection;

type AggregateQuery = {
	addresses?: string[];
} & Services.ClientPagination;

export class TransactionAggregate implements ITransactionAggregate {
	readonly #profile: IProfile;
	#history: Record<HistoryMethod, Record<string, HistoryWallet>> = {};

	public constructor(profile: IProfile) {
		this.#profile = profile;
	}

	/** {@inheritDoc ITransactionAggregate.all} */
	public async all(query: AggregateQuery = {}): Promise<ExtendedConfirmedTransactionDataCollection> {
		return this.#aggregate("all", query);
	}

	/** {@inheritDoc ITransactionAggregate.sent} */
	public async sent(query: AggregateQuery = {}): Promise<ExtendedConfirmedTransactionDataCollection> {
		return this.#aggregate("sent", query);
	}

	/** {@inheritDoc ITransactionAggregate.received} */
	public async received(query: AggregateQuery = {}): Promise<ExtendedConfirmedTransactionDataCollection> {
		return this.#aggregate("received", query);
	}

	/** {@inheritDoc ITransactionAggregate.hasMore} */
	public hasMore(method: string): boolean {
		return Object.values(this.#history[method] || {})
			.map((response) => response.hasMorePages())
			.includes(true);
	}

	/** {@inheritDoc ITransactionAggregate.flush} */
	public flush(method?: string): void {
		if (method) {
			this.#history[method] = {};
			return;
		}

		this.#history = {};
	}

	async #aggregate(method: string, query: AggregateQuery): Promise<ExtendedConfirmedTransactionDataCollection> {
		if (!this.#history[method]) {
			this.#history[method] = {};
		}

		const syncedWallets: IReadWriteWallet[] = this.#getWallets(query.addresses);

		const requests: Record<string, Promise<Collections.ConfirmedTransactionDataCollection>> = {};

		for (const syncedWallet of syncedWallets) {
			requests[syncedWallet.id()] = new Promise((resolve, reject) => {
				const lastResponse: HistoryWallet = this.#history[method][syncedWallet.id()];

				if (lastResponse && !lastResponse.hasMorePages()) {
					return reject(
						`Fetched all transactions for ${syncedWallet.id()}. Call [#flush] if you want to reset the history.`,
					);
				}

				if (lastResponse && lastResponse.hasMorePages()) {
					return resolve(
						syncedWallet.transactionIndex()[method]({ cursor: lastResponse.nextPage(), ...query }),
					);
				}

				return resolve(syncedWallet.transactionIndex()[method](query));
			});
		}

		const responses = await promiseAllSettledByKey<ExtendedConfirmedTransactionDataCollection>(requests);
		const result: ExtendedConfirmedTransactionData[] = [];

		for (const [id, request] of Object.entries(responses || {})) {
			if (request.status === "rejected" || request.value instanceof Error) {
				continue;
			}

			if (request.value.isEmpty()) {
				continue;
			}

			for (const transaction of request.value.items()) {
				result.push(transaction);
			}

			this.#history[method][id] = request.value;
		}

		return new ExtendedConfirmedTransactionDataCollection(result, {
			prev: undefined,
			self: undefined,
			next: Number(this.hasMore(method)),
			last: undefined,
		});
	}

	#getWallets(addresses: string[] = []): IReadWriteWallet[] {
		return this.#profile
			.wallets()
			.values()
			.filter((wallet: IReadWriteWallet) => {
				const matchesAddress = addresses.length > 0 ? addresses.includes(wallet.address()) : true;
				return matchesAddress && wallet.hasSyncedWithNetwork();
			});
	}
}
