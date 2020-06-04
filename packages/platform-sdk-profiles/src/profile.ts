import { ProfileSetting } from "./enums";
import { ContactRepository } from "./repositories/contact-repository";
import { DataRepository } from "./repositories/data-repository";
import { SettingRepository } from "./repositories/setting-repository";
import { WalletRepository } from "./repositories/wallet-repository";

export class Profile {
	#contactRepository!: ContactRepository;
	#walletRepository!: WalletRepository;
	#dataRepository!: DataRepository;
	#settingRepository!: SettingRepository;

	#id!: string;
	#name!: string;
	#avatar!: string;

	public constructor(id: string, name: string) {
		this.#id = id;
		this.#name = name;
		this.#contactRepository = new ContactRepository();
		this.#walletRepository = new WalletRepository();
		this.#dataRepository = new DataRepository("profile", "data");
		this.#settingRepository = new SettingRepository("profile", Object.values(ProfileSetting));
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

	public wallets(): WalletRepository {
		return this.#walletRepository;
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

	public async toObject(): Promise<any> {
		return {
			id: this.#id,
			name: this.#name,
			wallets: this.wallets().all(),
			contacts: this.contacts().all(),
			data: this.data().all(),
			settings: this.settings().all(),
		};
	}
}
