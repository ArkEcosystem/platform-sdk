import { Contracts } from "@arkecosystem/platform-sdk";

export class File {
	readonly #client: Contracts.HttpClient;

	public constructor(client: Contracts.HttpClient) {
		this.#client = client;
	}

	public async upload(data: Record<string, unknown>): Promise<string> {
		return (await this.#client.post("https://platform.ark.io/api/ipfs", { data })).json().data.hash as string;
	}

	public async get(hash: string): Promise<string> {
		return (await this.#client.get(`https://platform.ark.io/api/ipfs/${hash}`)).json().data as string;
	}
}
