import { BigNumber } from "@arkecosystem/platform-sdk-support";

import { Avatar } from "./avatar";
import { ProfileStruct } from "./contracts";
import { ProfileSetting } from "./enums";
import { ContactRepository } from "./repositories/contact-repository";
import { DataRepository } from "./repositories/data-repository";
import { NotificationRepository } from "./repositories/notification-repository";
import { SettingRepository } from "./repositories/setting-repository";
import { WalletRepository } from "./repositories/wallet-repository";
import { Wallet } from "./wallet";

export class Profile {
	#contactRepository!: ContactRepository;
	#walletRepository!: WalletRepository;
	#notificationRepository!: NotificationRepository;
	#dataRepository!: DataRepository;
	#settingRepository!: SettingRepository;

	#id!: string;
	#name!: string;
	#avatar!: string;

	public constructor(id: string, name: string) {
		this.#id = id;
		this.#name = name;
		this.#avatar = Avatar.make(id);
		this.#contactRepository = new ContactRepository(this);
		this.#walletRepository = new WalletRepository(this);
		this.#notificationRepository = new NotificationRepository();
		this.#dataRepository = new DataRepository();
		this.#settingRepository = new SettingRepository(Object.values(ProfileSetting));
	}

	public id(): string {
		return this.#id;
	}

	public name(): string {
		return this.#name;
	}

	public avatar(): string {
		return this.#avatar;
	}

	public balance(): BigNumber {
		return this.wallets()
			.values()
			.reduce((total: BigNumber, wallet: Wallet) => total.plus(wallet.balance()), BigNumber.ZERO);
	}

	public wallets(): WalletRepository {
		return this.#walletRepository;
	}

	public notifications(): NotificationRepository {
		return this.#notificationRepository;
	}

	public contacts(): ContactRepository {
		return this.#contactRepository;
	}

	public data(): DataRepository {
		return this.#dataRepository;
	}

	public settings(): SettingRepository {
		return this.#settingRepository;
	}

	public toObject(): ProfileStruct {
		return {
			id: this.id(),
			name: this.name(),
			wallets: this.wallets().toObject(),
			contacts: this.contacts().toObject(),
			notifications: this.notifications().all(),
			data: this.data().all(),
			settings: this.settings().all(),
		};
	}

	/**
	 * These methods serve as helpers to aggregate certain data for UI consumption.
	 */

	public countContacts(): number {
		return this.contacts().count();
	}

	public countNotifications(): number {
		return this.notifications().count();
	}

	public countWallets(): number {
		return this.wallets().count();
	}

	public balancePerCoin(): Record<string, { total: number; percentage: number }> {
		const result = {};

		const totalByProfile: BigNumber = this.balance();

		for (const [coin, wallets] of Object.entries(this.wallets().allByCoin())) {
			const totalByCoin: BigNumber = Object.values(wallets).reduce(
				(total: BigNumber, wallet: Wallet) => total.plus(wallet.balance()),
				BigNumber.ZERO,
			);

			result[coin] = {
				total: totalByCoin.toFixed(),
				percentage: totalByCoin.divide(totalByProfile).times(100).toFixed(2),
			};
		}

		return result;
	}
}
