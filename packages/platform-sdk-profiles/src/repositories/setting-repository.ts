import { DataRepository } from "./data-repository";

export class SettingRepository {
	#data: DataRepository;
	#allowedKeys: string[];

	public constructor(allowedKeys: string[]) {
		this.#data = new DataRepository();
		this.#allowedKeys = allowedKeys;
	}

	public all(): object {
		return this.#data.all();
	}

	public keys(): object {
		return this.#data.keys();
	}

	public get<T>(key: string, defaultValue?: T): T | undefined {
		this.assertValidKey(key);

		return this.#data.get(key, defaultValue);
	}

	public set(key: string, value: string | number | boolean | object): void {
		this.assertValidKey(key);

		this.#data.set(key, value);
	}

	public fill(entries: object): void {
		for (const [key, value] of Object.entries(entries)) {
			this.set(key, value);
		}
	}

	public has(key: string): boolean {
		this.assertValidKey(key);

		return this.#data.has(key);
	}

	public forget(key: string): void {
		this.assertValidKey(key);

		this.#data.forget(key);
	}

	public flush(): void {
		this.#data.flush();
	}

	private assertValidKey(key: string): void {
		if (this.#allowedKeys.includes(key)) {
			return;
		}

		throw new Error(`The [${key}] is not a valid setting.`);
	}
}
