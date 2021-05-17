import { Coins, Contracts, Http } from "@arkecosystem/platform-sdk";

export class PeerService implements Contracts.PeerService {
	readonly #config: Coins.Config;

	private constructor(config: Coins.Config) {
		this.#config = config;
	}

	public static async __construct(config: Coins.Config): Promise<PeerService> {
		return new PeerService(config);
	}

	public async __destruct(): Promise<void> {
		//
	}

	public async validate(url: string): Promise<boolean> {
		const response = await this.#config.get<Contracts.HttpClient>(Coins.ConfigKey.HttpClient).get(url);

		if (response.failed()) {
			throw new Http.BadResponseException(`Connected to ${url} but it returned a bad response.`);
		}

		return true;
	}
}
