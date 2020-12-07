import {
	ClientService,
	FeeService,
	IdentityService,
	KnownWalletService,
	LedgerService,
	LinkService,
	MessageService,
	MultiSignatureService,
	PeerService,
	TransactionService,
} from "../contracts/coins";
import { Config, ConfigKey } from "./config";
import { CoinServices } from "./contracts";
import { Manifest } from "./manifest";
import { Network } from "./network";
import { NetworkRepository } from "./network-repository";

export class Coin {
	readonly #networks: NetworkRepository;
	readonly #manifest: Manifest;
	readonly #config: Config;
	readonly #services: CoinServices;
	readonly #network: Network;

	public constructor({
		networks,
		manifest,
		config,
		services,
	}: {
		networks: NetworkRepository;
		manifest: Manifest;
		config: Config;
		services: CoinServices;
	}) {
		this.#networks = networks;
		this.#manifest = manifest;
		this.#config = config;
		this.#services = services;
		this.#network = new Network(manifest.get("name"), config.get(ConfigKey.Network));
	}

	public async destruct(): Promise<void> {
		await Promise.all([
			this.#services.client.destruct(),
			this.#services.fee.destruct(),
			this.#services.identity.destruct(),
			this.#services.knownWallets.destruct(),
			this.#services.ledger.destruct(),
			this.#services.link.destruct(),
			this.#services.message.destruct(),
			this.#services.multiSignature.destruct(),
			this.#services.peer.destruct(),
			this.#services.transaction.destruct(),
		]);
	}

	public network(): Network {
		return this.#network;
	}

	public networks(): NetworkRepository {
		return this.#networks;
	}

	public manifest(): Manifest {
		return this.#manifest;
	}

	public config(): Config {
		return this.#config;
	}

	public client(): ClientService {
		return this.#services.client;
	}

	public fee(): FeeService {
		return this.#services.fee;
	}

	public identity(): IdentityService {
		return this.#services.identity;
	}

	public knownWallets(): KnownWalletService {
		return this.#services.knownWallets;
	}

	public ledger(): LedgerService {
		return this.#services.ledger;
	}

	public link(): LinkService {
		return this.#services.link;
	}

	public message(): MessageService {
		return this.#services.message;
	}

	public multiSignature(): MultiSignatureService {
		return this.#services.multiSignature;
	}

	public peer(): PeerService {
		return this.#services.peer;
	}

	public transaction(): TransactionService {
		return this.#services.transaction;
	}
}
