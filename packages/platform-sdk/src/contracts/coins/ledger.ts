import { WalletData } from "./data";

export interface LedgerOptions {
	transport: LedgerTransport;
}

// TODO: create a proper contract for this
export type LedgerTransport = any;

export interface LedgerService {
	__destruct(): Promise<void>;

	connect(transport: LedgerTransport): Promise<void>;

	disconnect(): Promise<void>;

	getVersion(): Promise<string>;

	getPublicKey(path: string): Promise<string>;

	getExtendedPublicKey(path: string): Promise<string>;

	signTransaction(path: string, payload: Buffer): Promise<string>;

	signMessage(path: string, payload: Buffer): Promise<string>;

	scan(options?: { useLegacy: boolean }): Promise<Record<string, WalletData>>;
}
