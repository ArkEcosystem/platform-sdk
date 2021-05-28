export class MultiMnemonicSignatory {
	readonly #signingKeys: string[];
	readonly #identifiers: string[];

	public constructor(signingKeys: string[], identifiers: string[]) {
		this.#signingKeys = signingKeys;
		this.#identifiers = identifiers;
	}

	public signingKeys(): string[] {
		return this.#signingKeys.map((signingKey: string) => signingKey.normalize("NFD"));
	}

	public identifiers(): string[] {
		return this.#identifiers;
	}
}
