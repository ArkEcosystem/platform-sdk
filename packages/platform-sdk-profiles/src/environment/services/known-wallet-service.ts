import { Contracts } from "@arkecosystem/platform-sdk";

import { pqueue } from "../../helpers/queue";
import { container } from "../container";
import { Identifiers } from "../container.models";
import { CoinService } from "./coin-service";

type KnownWalletRegistry = Record<string, Contracts.KnownWallet[]>;

export class KnownWalletService {
	private registry: KnownWalletRegistry = {};

	public async syncAll(): Promise<void> {
		const promises: (() => Promise<void>)[] = [];

		for (const [coin, networks] of container.get<CoinService>(Identifiers.CoinService).entries()) {
			for (const network of networks) {
				promises.push(async () => {
					try {
						this.registry[network] = await container
							.get<CoinService>(Identifiers.CoinService)
							.get(coin, network)
							.knownWallets()
							.all();
					} catch (error) {
						// Do nothing if it fails. It's not critical functionality.
					}
				});
			}
		}

		await pqueue(promises);
	}

	public name(network: string, address: string): string | undefined {
		return this.findByAddress(network, address)?.name;
	}

	public is(network: string, address: string): boolean {
		return this.findByAddress(network, address) !== undefined;
	}

	public isExchange(network: string, address: string): boolean {
		return this.hasType(network, address, "exchange");
	}

	public isTeam(network: string, address: string): boolean {
		return this.hasType(network, address, "team");
	}

	private findByAddress(network: string, address: string): Contracts.KnownWallet | undefined {
		const registry: Contracts.KnownWallet[] = this.registry[network];

		if (registry === undefined) {
			return undefined;
		}

		return registry.find((wallet: Contracts.KnownWallet) => wallet.address === address);
	}

	private hasType(network: string, address: string, type: string): boolean {
		return this.findByAddress(network, address)?.type === type;
	}
}
