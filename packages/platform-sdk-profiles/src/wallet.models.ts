export interface WalletStruct {
	id: string;
	coin: string | undefined;
	coinConfig: {
		network: {
			crypto: {
				slip44: number;
			};
			currency: {
				symbol: string;
				ticker: string;
			};
			explorer: string;
			hosts: string[];
			id: string;
			name: string;
		};
	};
	network: string;
	address: string;
	publicKey: string | undefined;
	data: Record<string, any>;
	settings: Record<string, any>;
}

export enum WalletSetting {
	Alias = "ALIAS",
	Avatar = "AVATAR",
	Peer = "PEER",
}

export enum WalletData {
	Balance = "BALANCE",
	ExchangeRate = "EXCHANGE_RATE",
	Sequence = "SEQUENCE",
}

export enum WalletFlag {
	Ledger = "LEDGER",
	Starred = "STARRED",
}
