import { Managers } from "@arkecosystem/crypto";
import { Coins, Contracts, Helpers, IoC } from "@arkecosystem/platform-sdk";

import { container } from "./container";
import { Bindings } from "./contracts";
import * as Services from "./services";

export class ServiceProvider extends IoC.AbstractServiceProvider {
	public async make(): Promise<Coins.CoinServices> {
		await this.#retrieveNetworkConfiguration();

		return this.compose(Services, container);
	}

	async #retrieveNetworkConfiguration(): Promise<void> {
		const http: Contracts.HttpClient = this.config().get<Contracts.HttpClient>(Coins.ConfigKey.HttpClient);

		let peer: string = Helpers.randomHostFromConfig(this.config());

		const [crypto, status] = await Promise.all([
			http.get(`${peer}/node/configuration/crypto`),
			http.get(`${peer}/node/syncing`),
		]);

		const dataCrypto = crypto.json().data;
		const dataStatus = status.json().data;

		if (dataCrypto.network.client.token !== this.config().get(Coins.ConfigKey.CurrencyTicker)) {
			throw new Error(`Failed to connect to ${peer} because it is on another network.`);
		}

		Managers.configManager.setConfig(dataCrypto);
		Managers.configManager.setHeight(dataStatus.height);

		if (this.config().missing(Bindings.Crypto)) {
			this.config().set(Bindings.Crypto, dataCrypto);
		}

		if (this.config().missing(Bindings.Height)) {
			this.config().set(Bindings.Height, dataStatus.height);
		}
	}
}
