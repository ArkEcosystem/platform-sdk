import { KeyValuePair } from "../types";

export interface MarketData {
	currency: number;
	price: number;
	marketCap: number;
	volume: number;
	date: Date;
	change24h: number;
}

export type MarketDataCollection = Record<string, MarketData>;

export interface MarketTransformer {
	transform(options: KeyValuePair): MarketDataCollection;
}
