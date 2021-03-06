import { IPortfolio, IPortfolioEntry, IProfile } from "./contracts";

export class Portfolio implements IPortfolio {
	readonly #profile: IProfile;

	public constructor(profile: IProfile) {
		this.#profile = profile;
	}

	/** {@inheritDoc IPortfolio.breakdown} */
	public breakdown(): IPortfolioEntry[] {
		const result: Record<string, IPortfolioEntry> = {};

		for (const wallet of this.#profile.wallets().values()) {
			if (wallet.network().isTest()) {
				continue;
			}

			const ticker: string = wallet.network().ticker();

			if (result[ticker] === undefined) {
				result[ticker] = {
					coin: wallet.coin(),
					source: 0,
					target: 0,
					shares: 0,
				};
			}

			result[ticker].source += wallet.balance();
			result[ticker].target += wallet.convertedBalance();
		}

		let totalValue: number = 0;

		// Sum
		for (const item of Object.values(result)) {
			totalValue += item.target;
		}

		// Percentages
		for (const item of Object.values(result)) {
			item.shares += (item.target * 100) / totalValue;
		}

		return Object.values(result);
	}
}
