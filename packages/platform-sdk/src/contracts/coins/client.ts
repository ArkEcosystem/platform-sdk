import { TransactionDataCollection, WalletDataCollection } from "../../coins";
import { KeyValuePair } from "../types";
import { SignedTransactionData, TransactionData, WalletData } from "./data";

export type ClientPaginatorCursor = string | number | undefined;

export interface MetaPagination {
	prev: ClientPaginatorCursor;
	self: ClientPaginatorCursor;
	next: ClientPaginatorCursor;
}

export interface BroadcastResponse {
	accepted: string[];
	rejected: string[];
	errors: Record<string, string[]>;
}

export interface ClientService {
	destruct(): Promise<void>;

	transaction(id: string): Promise<TransactionData>;
	transactions(query: ClientTransactionsInput): Promise<TransactionDataCollection>;

	wallet(id: string): Promise<WalletData>;
	wallets(query: ClientWalletsInput): Promise<WalletDataCollection>;

	delegate(id: string): Promise<WalletData>;
	delegates(query?: ClientWalletsInput): Promise<WalletDataCollection>;

	votes(id: string): Promise<VoteReport>;
	// TODO: return struct like VoteReport
	voters(id: string, query?: KeyValuePair): Promise<WalletDataCollection>;

	syncing(): Promise<boolean>;

	broadcast(transactions: SignedTransactionData[]): Promise<BroadcastResponse>;
}

export interface ClientPagination {
	cursor?: string | number;
	limit?: number;
	orderBy?: string;
}

export interface ClientTransactionsInput extends ClientPagination {
	// Addresses
	address?: string;
	addresses?: string[];
	senderId?: string;
	recipientId?: string;
	// Public Keys
	senderPublicKey?: string;
	recipientPublicKey?: string;
	// AIP36
	entityType?: number;
	entitySubType?: number;
	entityAction?: string;
	// Meta
	asset?: Record<string, any>,
}

export interface ClientWalletsInput extends ClientPagination {
	address?: string;
	addresses?: string[];
	publicKey?: string;
	username?: string;
}

// TODO: move
export interface VoteReport {
	used: number;
	available: number;
	publicKeys: string[];
}
