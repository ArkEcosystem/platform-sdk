import { NotImplemented } from "../../exceptions";
import { KeyValuePair } from "../../types";
import { getJSON, postJSON } from "../../utils/get-json";
import { Client, CollectionResponse } from "../contracts/client";
import { Block, Delegate, Peer, Transaction, Wallet } from "./dto";

export class Bitcoin implements Client {
	readonly #baseUrl: string;

	public constructor(peer: string) {
		this.#baseUrl = peer;
	}

	public async getBlock(id: string): Promise<Block> {
		throw new NotImplemented(this.constructor.name, "getBlock");
	}

	public async getBlocks(query?: KeyValuePair): Promise<CollectionResponse<Block>> {
		throw new NotImplemented(this.constructor.name, "getBlocks");
	}

	public async searchBlocks(query: KeyValuePair): Promise<CollectionResponse<Block>> {
		throw new NotImplemented(this.constructor.name, "searchBlocks");
	}

	public async getTransaction(id: string): Promise<Transaction> {
		throw new NotImplemented(this.constructor.name, "getTransaction");
	}

	public async getTransactions(query?: KeyValuePair): Promise<CollectionResponse<Transaction>> {
		throw new NotImplemented(this.constructor.name, "getTransactions");
	}

	public async searchTransactions(query: KeyValuePair): Promise<CollectionResponse<Transaction>> {
		throw new NotImplemented(this.constructor.name, "searchTransactions");
	}

	public async getWallet(id: string): Promise<Wallet> {
		throw new NotImplemented(this.constructor.name, "getWallet");
	}

	public async getWallets(query?: KeyValuePair): Promise<CollectionResponse<Wallet>> {
		throw new NotImplemented(this.constructor.name, "getWallets");
	}

	public async searchWallets(query: KeyValuePair): Promise<CollectionResponse<Wallet>> {
		throw new NotImplemented(this.constructor.name, "searchWallets");
	}

	public async getDelegate(id: string): Promise<Delegate> {
		throw new NotImplemented(this.constructor.name, "getDelegate");
	}

	public async getDelegates(query?: KeyValuePair): Promise<CollectionResponse<Delegate>> {
		throw new NotImplemented(this.constructor.name, "getDelegates");
	}

	public async getPeers(query?: KeyValuePair): Promise<CollectionResponse<Peer>> {
		throw new NotImplemented(this.constructor.name, "getPeers");
	}

	public async getConfiguration(): Promise<any> {
		throw new NotImplemented(this.constructor.name, "getConfiguration");
	}

	public async getCryptoConfiguration(): Promise<any> {
		throw new NotImplemented(this.constructor.name, "getCryptoConfiguration");
	}

	public async getFeesByNode(days: number): Promise<any> {
		throw new NotImplemented(this.constructor.name, "getFeesByNode");
	}

	public async getFeesByType(): Promise<any> {
		throw new NotImplemented(this.constructor.name, "getFeesByType");
	}

	public async getSyncStatus(): Promise<any> {
		throw new NotImplemented(this.constructor.name, "getSyncStatus");
	}

	public async postTransactions(transactions: object[]): Promise<any> {
		throw new NotImplemented(this.constructor.name, "postTransactions");
	}

	private async get(path: string, query?: KeyValuePair): Promise<any> {
		return getJSON(`${this.#baseUrl}/${path}`, query);
	}

	private async post(path: string, body: KeyValuePair): Promise<any> {
		return postJSON(`${this.#baseUrl}/`, path, body);
	}
}
