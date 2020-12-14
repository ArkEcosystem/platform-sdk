import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { MarketService } from "@arkecosystem/platform-sdk-markets";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

import { pqueueSettled } from "../../helpers/queue";
import { Profile } from "../../profiles/profile";
import { ProfileSetting } from "../../profiles/profile.models";
import { DataRepository } from "../../repositories/data-repository";
import { ProfileRepository } from "../../repositories/profile-repository";
import { Cache } from "../../services/cache";
import { ReadWriteWallet, WalletData } from "../../wallets/wallet.models";
import { container } from "../container";
import { Identifiers } from "../container.models";

export class ExchangeRateService {
	readonly #ttl: number = 10;
	readonly #cache = new Cache("ExchangeRates");
	readonly #dataRepository: DataRepository = new DataRepository();

	public constructor(options?: { ttl?: number }) {
		if (options?.ttl) {
			this.#ttl = options.ttl;
		}
	}

	public async syncAll(): Promise<void> {
		const profiles: Profile[] = container.get<ProfileRepository>(Identifiers.ProfileRepository).values();

		const promises: (() => Promise<void>)[] = [];
		for (const profile of profiles) {
			for (const [currency, wallets] of Object.entries(profile.wallets().allByCoin())) {
				promises.push(() => this.syncCoinByProfile(profile, currency, Object.values(wallets)));
			}
		}

		await pqueueSettled(promises);
	}

	public async syncCoinByProfile(profile: Profile, currency: string, wallets?: ReadWriteWallet[]): Promise<void> {
		if (wallets === undefined) {
			wallets = profile
				.wallets()
				.values()
				.filter((wallet: ReadWriteWallet) => wallet.currency() === currency && wallet.network().isLive());
		} else {
			wallets = wallets.filter((wallet: ReadWriteWallet) => wallet.network().isLive());
		}

		if (!wallets.length) {
			return;
		}

		const exchangeCurrency: string = profile.settings().get(ProfileSetting.ExchangeCurrency) || "BTC";
		if (this.#cache.has(this.storageKey(currency, exchangeCurrency))) {
			return;
		}

		const marketService = MarketService.make(
			profile.settings().get(ProfileSetting.MarketProvider) || "coingecko",
			container.get(Identifiers.HttpClient),
		);

		const exchangeRate = await marketService.dailyAverage(currency, exchangeCurrency, +Date.now());

		this.setRate(currency, exchangeCurrency, exchangeRate);
		this.#cache.set(this.storageKey(currency, exchangeCurrency), true, this.#ttl);
	}

	private storageKey(currency: string, exchangeCurrency: string) {
		return `${currency}-${exchangeCurrency}`;
	}

	private setRate(
		currency: string,
		exchangeCurrency: string,
		exchangeRate: number,
		date?: string | number | DateTime,
	): void {
		const activeDate = DateTime.make(date).format("YYYY-MM-DD");
		const storageKey = `${this.storageKey(currency, exchangeCurrency)}.${activeDate}`;
		this.#dataRepository.set(storageKey, exchangeRate);
	}

	public allRates() {
		return this.#dataRepository.all();
	}

	public ratesByDate(currency: string, exchangeCurrency: string, date?: string | number | DateTime): BigNumber {
		const activeDate = DateTime.make(date).format("YYYY-MM-DD");
		const storageKey = `${this.storageKey(currency, exchangeCurrency)}.${activeDate}`;
		const rate: number | undefined = this.#dataRepository.get(storageKey);

		if (!rate) {
			return BigNumber.ZERO;
		}

		return BigNumber.make(rate);
	}
}
