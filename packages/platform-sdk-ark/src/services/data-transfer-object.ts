import { Coins, Contracts, Helpers, Services } from "@arkecosystem/platform-sdk";
import { KeyValuePair } from "@arkecosystem/platform-sdk/dist/contracts";

import * as DTO from "../dto";

export class DataTransferObjectService extends Services.AbstractDataTransferObjectService {
	public constructor(private decimals: number) { }

	public static async __construct(config: Coins.Config): Promise<DataTransferObjectService> {
		return new DataTransferObjectService(config.get(Coins.ConfigKey.CurrencyDecimals));
	}

	public signedTransaction(identifier: string, signedData: string): Contracts.SignedTransactionData {
		return new DTO.SignedTransactionData(identifier, signedData, signedData);
	}

	public transaction(transaction: KeyValuePair): Contracts.TransactionDataType {
		return Helpers.createTransactionDataWithType([transaction, this.decimals], DTO);
	}
}
