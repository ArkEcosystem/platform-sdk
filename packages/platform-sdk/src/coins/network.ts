import { get } from "dot-prop";

import { CoinManifest, ExpirationType, NetworkManifest } from "./network.models";

export class Network {
	/**
	 * The coin of the network.
	 *
	 * @memberof Network
	 */
	readonly #coin: CoinManifest;

	/**
	 * The manifest of the network.
	 *
	 * @memberof Network
	 */
	readonly #network: NetworkManifest;

	/**
	 * Create a new Network instance.
	 *
	 * @param {string} coin
	 * @param {NetworkManifest} network
	 * @memberof Network
	 */
	public constructor(coin: CoinManifest, network: NetworkManifest) {
		this.#coin = coin;
		this.#network = network;
	}

	/**
	 * Get the parent coin of the network.
	 */
	public coin(): string {
		return this.#coin.name;
	}

	/**
	 * Get the coin of the network.
	 */
	public coinName(): string {
		return this.#network.coin;
	}

	/**
	 * Get the ID of the network.
	 */
	public id(): string {
		return this.#network.id;
	}

	/**
	 * Get the name of the network.
	 */
	public name(): string {
		return this.#network.name;
	}

	/**
	 * Get the explorer URL of the coin that is used.
	 */
	public explorer(): string {
		return this.#network.explorer;
	}

	/**
	 * Get the ticker of the coin that is used.
	 */
	public ticker(): string {
		return this.#network.currency.ticker;
	}

	/**
	 * Get the symbol of the coin that is used.
	 */
	public symbol(): string {
		return this.#network.currency.symbol;
	}

	/**
	 * Determine if this is a production network.
	 */
	public isLive(): boolean {
		return this.#network.type === "live";
	}

	/**
	 * Determine if this is a development network.
	 */
	public isTest(): boolean {
		return this.#network.type === "test";
	}

	/**
	 * Get the expiration method type.
	 */
	public expirationType(): ExpirationType {
		return this.#network.crypto.expirationType;
	}

	/**
	 * Determine if voting is supported on this network.
	 */
	public allowsVoting(): boolean {
		return get(this.#network, "governance.voting.enabled", false);
	}

	/**
	 * Get the number of delegates that forge blocks.
	 */
	public delegateCount(): number {
		return get(this.#network, "governance.voting.delegateCount", 0);
	}

	/**
	 * Get the maximum number of votes per wallet.
	 */
	public maximumVotesPerWallet(): number {
		return get(this.#network, "governance.voting.maximumPerWallet", 0);
	}

	/**
	 * Get the maximum number of votes per transaction.
	 */
	public maximumVotesPerTransaction(): number {
		return get(this.#network, "governance.voting.maximumPerTransaction", 0);
	}

	/**
	 * Determine if the network uses an extended public key for derivation.
	 */
	public usesExtendedPublicKey(): boolean {
		return get(this.#network, "crypto.derivation.extendedPublicKey") === true;
	}

	/**
	 * Determine if the given feature is enabled.
	 *
	 * @param feature
	 */
	public allows(feature: string): boolean {
		return get(this.#network.featureFlags, feature) === true;
	}

	/**
	 * Determine if the given feature is disabled.
	 *
	 * @param feature
	 */
	public denies(feature: string): boolean {
		return !this.allows(feature);
	}

	/**
	 * Determines if the network charges static fees.
	 *
	 * @return {*}  {boolean}
	 * @memberof Network
	 */
	public chargesStaticFees(): boolean {
		return get(this.#network, "fees.type") === "static";
	}

	/**
	 * Determines if the network charges dynamic fees.
	 *
	 * @return {*}  {boolean}
	 * @memberof Network
	 */
	public chargesDynamicFees(): boolean {
		return get(this.#network, "fees.type") === "dynamic";
	}

	/**
	 * Determines if the network charges gas fees.
	 *
	 * @return {*}  {boolean}
	 * @memberof Network
	 */
	public chargesGasFees(): boolean {
		return get(this.#network, "fees.type") === "gas";
	}

	/**
	 * Determines if the network charges weight fees.
	 *
	 * @return {*}  {boolean}
	 * @memberof Network
	 */
	public chargesWeightFees(): boolean {
		return get(this.#network, "fees.type") === "weight";
	}

	/**
	 * Determines if the network charges zero fees.
	 *
	 * @return {*}  {boolean}
	 * @memberof Network
	 */
	public chargesZeroFees(): boolean {
		return get(this.#network, "fees.type") === "free";
	}

	/**
	 * Return the object representation of the network.
	 */
	public toObject(): NetworkManifest {
		return this.#network;
	}

	/**
	 * Return the JSON representation of the network.
	 */
	public toJson(): string {
		return JSON.stringify(this.toObject());
	}
}
