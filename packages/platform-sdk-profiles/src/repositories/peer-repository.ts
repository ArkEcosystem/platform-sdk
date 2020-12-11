import { Profile } from "../profiles/profile";
import { DataRepository } from "./data-repository";

interface Peer {
	name: string;
	host: string;
	isMultiSignature: boolean;
}

export class PeerRepository {
	readonly #data: DataRepository = new DataRepository();

	public fill(peers: object): void {
		for (const [id, peer] of Object.entries(peers)) {
			this.#data.set(id, peer);
		}
	}

	public all(): Record<string, Peer> {
		return this.#data.all() as Record<string, Peer>;
	}

	public keys(): string[] {
		return this.#data.keys();
	}

	public values(): Profile[] {
		return this.#data.values();
	}

	public get(coin: string, network: string): Peer[] {
		const id = `${coin}.${network}`;

		if (this.#data.missing(id)) {
			throw new Error(`No peers found for [${id}].`);
		}

		return this.#data.get(id) as Peer[];
	}

	public create(coin: string, network: string, peer: Peer): void {
		const key = `${coin}.${network}`;
		const value: Peer[] = this.#data.get<Peer[]>(key) || [];

		value.push(peer);

		this.#data.set(key, value);
	}

	public has(coin: string, network: string): boolean {
		return this.#data.has(`${coin}.${network}`);
	}

	public update(coin: string, network: string, host: string, peer: Peer): void {
		const index: number = this.get(coin, network).findIndex((item: Peer) => item.host === host);

		if (index === -1) {
			throw new Error(`Failed to find a peer with [${host}] as host.`);
		}

		this.#data.set(`${coin}.${network}.${index}`, peer);
	}

	public forget(coin: string, network: string, peer: Peer): void {
		const index: number = this.get(coin, network).findIndex((item: Peer) => item.host === peer.host);

		if (index === -1) {
			throw new Error(`Failed to find a peer with [${peer.host}] as host.`);
		}

		this.#data.forgetIndex(`${coin}.${network}`, index);

		// If the list is empty we want to completely remove it.
		/* istanbul ignore next */
		if ((this.#data.get<Peer[]>(`${coin}.${network}`) || []).filter(Boolean).length <= 0) {
			this.#data.forget(`${coin}.${network}`);
		}
	}

	public toObject(): Record<string, Peer> {
		return this.all();
	}

	// Helpers to get peers of specific types for a coin and network.

	public getRelay(coin: string, network: string): Peer | undefined {
		return this.get(coin, network).find((peer: Peer) => peer.isMultiSignature === false);
	}

	public getRelays(coin: string, network: string): Peer[] {
		return this.get(coin, network).filter((peer: Peer) => peer.isMultiSignature === false);
	}

	public getMultiSignature(coin: string, network: string): Peer | undefined {
		return this.get(coin, network).find((peer: Peer) => peer.isMultiSignature === true);
	}
}
