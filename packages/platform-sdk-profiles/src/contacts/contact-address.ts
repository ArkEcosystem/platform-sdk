import { Coins, Contracts } from "@arkecosystem/platform-sdk";

import { makeCoin } from "../environment/container.helpers";
import { Avatar } from "../services/avatar";
import { ContactAddressProps } from "./contact-address.models";

export class ContactAddress {
	readonly #coin: Coins.Coin;
	readonly #data: ContactAddressProps;
	#wallet: Contracts.WalletData | undefined;

	private constructor(data: ContactAddressProps, coin: Coins.Coin) {
		this.#data = data;
		this.#coin = coin;
	}

	public static async make(data: ContactAddressProps): Promise<ContactAddress> {
		const result: ContactAddress = new ContactAddress(data, await makeCoin(data.coin, data.network));

		await result.syncIdentity();

		return result;
	}

	public id(): string {
		return this.#data.id;
	}

	public coin(): string {
		return this.#data.coin;
	}

	public network(): string {
		return this.#data.network;
	}

	public name(): string {
		return this.#data.name;
	}

	public address(): string {
		return this.#data.address;
	}

	public avatar(): string {
		return Avatar.make(this.address());
	}

	public isDelegate(): boolean {
		if (!this.#wallet) {
			throw new Error("This contact has not been synchronized yet. Please call [syncIdentity] before using it.");
		}

		return this.#wallet.isDelegate();
	}

	public isKnown(): boolean {
		if (!this.#wallet) {
			throw new Error("This contact has not been synchronized yet. Please call [syncIdentity] before using it.");
		}

		return this.#wallet.isKnown();
	}

	public isMultiSignature(): boolean {
		if (!this.#wallet) {
			throw new Error("This contact has not been synchronized yet. Please call [syncIdentity] before using it.");
		}

		return this.#wallet.isMultiSignature();
	}

	public isSecondSignature(): boolean {
		if (!this.#wallet) {
			throw new Error("This contact has not been synchronized yet. Please call [syncIdentity] before using it.");
		}

		return this.#wallet.isSecondSignature();
	}

	public hasSyncedWithNetwork(): boolean {
		if (this.#wallet === undefined) {
			return false;
		}

		return this.#wallet.hasPassed();
	}

	public toObject(): ContactAddressProps {
		return {
			id: this.id(),
			coin: this.coin(),
			network: this.network(),
			name: this.name(),
			address: this.address(),
		};
	}

	public setName(value: string): void {
		this.#data.name = value;
	}

	public setAddress(name: string): void {
		this.#data.address = name;
	}

	/**
	 * These methods serve as helpers to keep the data updated.
	 */

	public async syncIdentity(): Promise<void> {
		const currentWallet = this.#wallet;

		try {
			this.#wallet = await this.#coin.client().wallet(this.address());
		} catch {
			this.#wallet = currentWallet;
		}
	}
}
