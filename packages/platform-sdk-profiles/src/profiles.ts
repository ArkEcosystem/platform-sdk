import { v4 as uuidv4 } from "uuid";

import { Storage } from "./contracts";
import { Profile } from "./profile";

export class Profiles {
	readonly #key: string = "profiles";
	readonly #storage: Storage;

	public constructor(storage: Storage) {
		this.#storage = storage;
	}

	public async all(): Promise<Profile[]> {
		const result: any[] | undefined = await this.#storage.get(this.#key);

		if (!result) {
			return [];
		}

		return result.map(
			(profile) =>
				new Profile({
					...profile,
					storage: this.#storage,
				}),
		);
	}

	public async get(id: string): Promise<Profile> {
		const profiles: Profile[] = await this.all();

		const result: Profile | undefined = profiles.find((item: Profile) => item.id() === id);

		if (!result) {
			throw new Error(`No profile found for [${id}].`);
		}

		return result;
	}

	public async push(name: string): Promise<Profile> {
		const profiles: Profile[] = await this.all();

		for (const profile of profiles) {
			if (profile.name() === name) {
				throw new Error(`The name [${name}] is already taken.`);
			}
		}

		const result: Profile = new Profile({
			id: uuidv4(),
			name,
			wallets: [],
			storage: this.#storage,
		});

		profiles.push(result);

		await this.#storage.set(
			this.#key,
			profiles.map((item: Profile) => item.toObject()),
		);

		return result;
	}

	public async forget(id: string): Promise<Profile[]> {
		const profiles: Profile[] = await this.all();

		const result: Profile[] | undefined = profiles.filter((item: Profile) => item.id() !== id);

		if (!result) {
			throw new Error(`No profile found for [${id}].`);
		}

		await this.#storage.set(
			this.#key,
			result.map((item: Profile) => item.toObject()),
		);

		return result;
	}
}
