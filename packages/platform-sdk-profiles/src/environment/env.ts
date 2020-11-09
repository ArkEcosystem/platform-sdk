import { Coins } from "@arkecosystem/platform-sdk";
import { Validator, ValidatorSchema } from "@arkecosystem/platform-sdk-support";

import { DataRepository } from "../repositories/data-repository";
import { ProfileRepository } from "../repositories/profile-repository";
import { container } from "./container";
import { makeCoin } from "./container.helpers";
import { Identifiers } from "./container.models";
import { CoinList, EnvironmentOptions, Storage, StorageData } from "./env.models";
import { Migrator } from "./migrator";
import { CoinService } from "./services/coin-service";
import { DelegateService } from "./services/delegate-service";
import { ExchangeRateService } from "./services/exchange-rate-service";
import { FeeService } from "./services/fee-service";
import { WalletService } from "./services/wallet-service";
import { StorageFactory } from "./storage/factory";

export class Environment {
	private storage: StorageData | undefined;

	public constructor(options: EnvironmentOptions) {
		container.set(
			Identifiers.Storage,
			typeof options.storage === "string" ? StorageFactory.make(options.storage) : options.storage,
		);

		container.set(Identifiers.AppData, new DataRepository());
		container.set(Identifiers.HttpClient, options.httpClient);
		container.set(Identifiers.ProfileRepository, new ProfileRepository());
		container.set(Identifiers.CoinService, new CoinService());
		container.set(Identifiers.DelegateService, new DelegateService());
		container.set(Identifiers.ExchangeRateService, new ExchangeRateService());
		container.set(Identifiers.FeeService, new FeeService());
		container.set(Identifiers.WalletService, new WalletService());

		container.set(Identifiers.Coins, options.coins);
	}

	/**
	 * Verify the integrity of the storage.
	 *
	 * @param {StorageData} { data, profiles }
	 * @returns {Promise<void>}
	 * @memberof Environment
	 */
	public async verify(storage?: StorageData): Promise<void> {
		if (!storage) {
			storage = ((await container.get<Storage>(Identifiers.Storage).all()) as unknown) as StorageData;
		}

		let { data, profiles } = storage;

		const mapRules = (map: object, rule: Function) =>
			Object.keys(map).reduce((newMap, key) => ({ ...newMap, [key]: rule }), {});

		const { array, boolean, object, string, number, lazy } = ValidatorSchema;

		const validator = new Validator();

		const schema = lazy(({ profiles }) => {
			const rules = {};

			for (const key of Object.keys(profiles)) {
				rules[key] = object({
					id: string().required(),
					contacts: object(
						mapRules(
							profiles[key].contacts,
							object({
								id: string().required(),
								name: string().required(),
								addresses: array().of(
									object({
										id: string().required(),
										coin: string().required(),
										network: string().required(),
										name: string().required(),
										address: string().required(),
									}).noUnknown(),
								),
								starred: boolean().required(),
							}).noUnknown(),
						),
					),
					// TODO: stricter validation to avoid unknown keys or values
					data: object().required(),
					// TODO: stricter validation to avoid unknown keys or values
					notifications: object().required(),
					// TODO: stricter validation to avoid unknown keys or values
					peers: object().required(),
					// TODO: stricter validation to avoid unknown keys or values
					plugins: object({
						data: object(),
						blacklist: array().of(number()),
					})
						.default({ data: {}, blacklist: [] })
						.noUnknown(),
					// TODO: stricter validation to avoid unknown keys or values
					settings: object().required(),
					wallets: object(
						mapRules(
							profiles[key].wallets,
							object({
								id: string().required(),
								coin: string().required(),
								network: string().required(),
								networkConfig: object({
									crypto: object({
										slip44: number().integer().required(),
									}).required(),
									networking: object({
										hosts: array().of(string()).required(),
										hostsMultiSignature: array().of(string()),
									}).required(),
								}).noUnknown(),
								address: string().required(),
								publicKey: string().required(),
								data: object().required(),
								settings: object().required(),
							}).noUnknown(),
						),
					),
				}).noUnknown();
			}

			return object({ profiles: object(rules), data: object() });
		});

		if (!data) {
			data = {};
		}

		if (!profiles) {
			profiles = {};
		}

		const validated = schema.validateSync(
			{ data, profiles },
			{
				strict: true,
			},
		);

		if (validator.fails()) {
			throw new Error("Terminating due to corrupted state.");
		}

		this.storage = validated;
	}

	/**
	 * Load the data from the storage.
	 *
	 * This has to be manually called and should always be called before booting
	 * of the environment instance. This will generally be only called on application start.
	 *
	 * @returns {Promise<void>}
	 * @memberof Environment
	 */
	public async boot(): Promise<void> {
		if (!this.storage) {
			throw new Error("Please call [verify] before booting the environment.");
		}

		if (this.storage.data) {
			this.data().fill(this.storage.data);
		}

		if (this.storage.profiles) {
			await this.profiles().fill(this.storage.profiles);
		}
	}

	/**
	 * Save the data to the storage.
	 *
	 * This has to be manually called and should always be called before disposing
	 * of the environment instance. For example on application shutdown or when switching profiles.
	 *
	 * @returns {Promise<void>}
	 * @memberof Environment
	 */
	public async persist(): Promise<void> {
		const storage: Storage = container.get<Storage>(Identifiers.Storage);

		await storage.set("profiles", this.profiles().toObject());

		await storage.set("data", this.data().all());
	}

	public coins(): CoinService {
		return container.get(Identifiers.CoinService);
	}

	public data(): DataRepository {
		return container.get(Identifiers.AppData);
	}

	public delegates(): DelegateService {
		return container.get(Identifiers.DelegateService);
	}

	public exchangeRates(): ExchangeRateService {
		return container.get(Identifiers.ExchangeRateService);
	}

	public fees(): FeeService {
		return container.get(Identifiers.FeeService);
	}
	public profiles(): ProfileRepository {
		return container.get(Identifiers.ProfileRepository);
	}

	public wallets(): WalletService {
		return container.get(Identifiers.WalletService);
	}

	public async migrate(migrations: object, versionToMigrate: string): Promise<void> {
		await container.get<Migrator>(Identifiers.Migrator).migrate(migrations, versionToMigrate);
	}

	/**
	 * Creates an instance of a concrete coin implementation like ARK or BTC.
	 *
	 * The only times it should be used is when identity data has to be validated!
	 *
	 * It should never be used for anything else within ArkEcosystem products because
	 * this package is responsible for abstracting all of the coin-specific interactions.
	 *
	 * @param {string} coin
	 * @param {string} network
	 * @returns {Promise<Coins.Coin>}
	 * @memberof Environment
	 */
	public async coin(coin: string, network: string): Promise<Coins.Coin> {
		return makeCoin(coin, network);
	}

	/**
	 * Register a new coin implementation by its ticker, for example ARK or BTC.
	 *
	 * @param {string} coin
	 * @param {Coins.CoinSpec} spec
	 * @memberof Environment
	 */
	public registerCoin(coin: string, spec: Coins.CoinSpec): void {
		if (container.get<CoinList>(Identifiers.Coins)[coin]) {
			throw new Error(`The coin [${coin}] is already registered.`);
		}

		container.get<CoinList>(Identifiers.Coins)[coin] = spec;
	}

	public availableNetworks(): Coins.Network[] {
		const coins: CoinList = container.get<CoinList>(Identifiers.Coins);

		const result: Coins.Network[] = [];

		for (const [coin, data] of Object.entries(coins)) {
			const networks: Coins.CoinNetwork[] = Object.values(data.manifest.networks);

			for (const network of networks) {
				result.push(new Coins.Network(coin, network));
			}
		}

		return result;
	}

	public usedCoinsWithNetworks(): Record<string, string[]> {
		if (!this.storage) {
			throw new Error("Please call [verify] before looking up profile data.");
		}

		const result: Record<string, string[]> = {};

		for (const profile of Object.values(this.storage.profiles) as any) {
			for (const wallet of Object.values(profile.wallets) as any) {
				if (!result[wallet.coin]) {
					result[wallet.coin] = [];
				}

				if (!result[wallet.coin].includes(wallet.network)) {
					result[wallet.coin].push(wallet.network);
				}
			}
		}

		return result;
	}
}
