import { v4 as uuidv4 } from "uuid";
import { injectable } from "inversify";
import { IProfileRepository, IProfileExportOptions, IProfile } from "../../../contracts";

import { Profile } from "../profiles/profile";
import { ProfileFactory } from "../profiles/profile.factory";
import { DataRepository } from "../../../repositories/data-repository";

@injectable()
export class ProfileRepository implements IProfileRepository {
	readonly #data: DataRepository;

	public constructor() {
		this.#data = new DataRepository();
	}

	public fill(profiles: object): void {
		for (const [id, profile] of Object.entries(profiles)) {
			this.#data.set(id, new Profile(profile));
		}
	}

	public all(): Record<string, IProfile> {
		return this.#data.all() as Record<string, IProfile>;
	}

	public first(): IProfile {
		return this.#data.first();
	}

	public last(): IProfile {
		return this.#data.last();
	}

	public keys(): string[] {
		return this.#data.keys();
	}

	public values(): IProfile[] {
		return this.#data.values();
	}

	public findById(id: string): IProfile {
		if (this.#data.missing(id)) {
			throw new Error(`No profile found for [${id}].`);
		}

		return this.#data.get(id) as IProfile;
	}

	public findByName(name: string): IProfile | undefined {
		return this.values().find((profile: IProfile) => profile.name().toLowerCase() === name.toLowerCase());
	}

	public create(name: string): Promise<IProfile> {
		if (this.findByName(name)) {
			throw new Error(`The profile [${name}] already exists.`);
		}

		const result: IProfile = ProfileFactory.fromName(name);

		this.#data.set(result.id(), result);

		return Promise.resolve(result);
	}

	public async import(data: string, password?: string): Promise<Profile> {
		const profile = new Profile({
			id: uuidv4(),
			name: "",
			password,
			data,
		});
		await profile.restore(password);
		return profile;
	}

	public export(profile: IProfile, options: IProfileExportOptions, password?: string): string {
		return profile.export(password, options);
	}

	public has(id: string): boolean {
		return this.#data.has(id);
	}

	public forget(id: string): void {
		if (this.#data.missing(id)) {
			throw new Error(`No profile found for [${id}].`);
		}

		this.#data.forget(id);
	}

	public flush(): void {
		this.#data.flush();
	}

	public count(): number {
		return this.#data.count();
	}

	public toObject(): Promise<Record<string, object>> {
		const result: Record<string, object> = {};
		const profiles: [string, Profile][] = Object.entries(this.#data.all());

		for (const [id, profile] of profiles) {
			result[id] = profile.dump();
		}

		return Promise.resolve(result);
	}
}
