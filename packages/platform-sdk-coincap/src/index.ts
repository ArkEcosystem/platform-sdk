import { Contracts, Exceptions } from "@arkecosystem/platform-sdk";
import { DateTime } from "@arkecosystem/platform-sdk-intl";

import { HistoricalPriceTransformer } from "./transformers/historical-price-transformer";
import { MarketTransformer } from "./transformers/market-transformer";

export class PriceTracker implements Contracts.PriceTracker {
	private readonly tokenLookup: Contracts.KeyValuePair = {};

	readonly #httpClient: Contracts.HttpClient;
	readonly #host: string = "https://api.coincap.io/v2";

	public constructor(httpClient: Contracts.HttpClient) {
		this.#httpClient = httpClient;
	}

	public async verifyToken(token: string): Promise<boolean> {
		try {
			const tokenData = await this.fetchTokenData(token);

			return !!tokenData["id"];
		} catch {
			return false;
		}
	}

	public async marketData(token: string): Promise<Contracts.MarketDataCollection> {
		const tokenId = await this.getTokenId(token);

		if (!tokenId) {
			throw new Error("Failed to determine the token.");
		}

		const response = await this.getCurrencyData(token);

		return new MarketTransformer(response).transform({ token: tokenId });
	}

	public async historicalPrice(options: Contracts.HistoricalPriceOptions): Promise<Contracts.HistoricalData> {
		const tokenId = await this.getTokenId(options.token);

		const { rates } = await this.getCurrencyData(options.token);
		const daysSubtract = options.days === 24 ? 1 : options.days;
		const timeInterval = options.days === 24 ? "h1" : "h12";
		const startDate = DateTime.make().subDays(daysSubtract).valueOf();
		const endDate = DateTime.make().valueOf();
		const body = await this.get(`assets/${tokenId}/history`, {
			interval: timeInterval,
			start: startDate,
			end: endDate,
		});

		return new HistoricalPriceTransformer(body.data).transform({
			token: tokenId,
			currency: options.currency,
			rates,
			dateFormat: options.dateFormat,
		});
	}

	public async historicalVolume(options: Contracts.HistoricalVolumeOptions): Promise<Contracts.HistoricalData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "historicalVolume");
	}

	public async dailyAverage(options: Contracts.DailyAverageOptions): Promise<number> {
		const tokenId = await this.getTokenId(options.token);

		const start = DateTime.make(options.timestamp).startOf("day").valueOf();
		const end = DateTime.make(start).addDay().valueOf();

		const response = await this.get(`assets/${tokenId}/history`, {
			interval: "h1",
			start,
			end,
		});

		if (!response.data.length) {
			return 0;
		}

		const priceUsd = response.data.reduce((acc, data) => acc + Number(data.priceUsd), 0) / response.data.length;

		const { data } = await this.get("rates");

		return priceUsd * Number(data.find((rate: any) => rate.symbol === options.currency.toUpperCase()).rateUsd);
	}

	private async getTokenId(token: string, limit = 1000): Promise<string> {
		if (Object.keys(this.tokenLookup).length > 0) {
			return this.tokenLookup[token.toUpperCase()];
		}

		const body = await this.get("assets", { limit });

		for (const value of Object.values(body.data)) {
			// @ts-ignore
			this.tokenLookup[value.symbol.toUpperCase()] = value.id;
		}

		return this.tokenLookup[token.toUpperCase()];
	}

	private async fetchTokenData(token: string): Promise<Contracts.KeyValuePair> {
		const tokenId = await this.getTokenId(token);

		const body = await this.get(`assets/${tokenId}`);

		return body.data;
	}

	private async getCurrencyData(token: string): Promise<Contracts.KeyValuePair> {
		const body = await this.get("rates");
		const { data, timestamp } = body;
		const tokenData = await this.fetchTokenData(token);

		const response = {
			assets: { [tokenData["symbol"].toUpperCase()]: tokenData },
			rates: { [tokenData["symbol"].toUpperCase()]: tokenData["priceUsd"] },
			timestamp,
		};

		for (const value of data) {
			response.assets[value.symbol.toUpperCase()] = value;
			response.rates[value.symbol.toUpperCase()] = value.rateUsd;
		}

		return response;
	}

	private async get(path: string, query = {}): Promise<any> {
		const response = await this.#httpClient.get(`${this.#host}/${path}`, query);

		return response.json();
	}
}
