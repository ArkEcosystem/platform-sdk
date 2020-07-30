import { TransactionDataType } from "../../contracts/coins/data";

export class TransactionDataCollection {
	#transactions: TransactionDataType[];

	public constructor(transactions: TransactionDataType[]) {
		this.#transactions = transactions;
	}

	public all(): TransactionDataType[] {
		return this.#transactions;
	}

	public first(): TransactionDataType {
		return this.#transactions[0];
	}

	public findById(id: string): TransactionDataType | undefined {
		return this.find("id", id);
	}

	public findByType(type: string): TransactionDataType | undefined {
		return this.find("type", type);
	}

	public findByTimestamp(timestamp: string): TransactionDataType | undefined {
		return this.find("timestamp", timestamp);
	}

	public findBySender(sender: string): TransactionDataType | undefined {
		return this.find("sender", sender);
	}

	public findByRecipient(recipient: string): TransactionDataType | undefined {
		return this.find("recipient", recipient);
	}

	private find(key: string, value: string): TransactionDataType | undefined {
		return this.#transactions.find((transaction: TransactionDataType) => transaction[key]() === value);
	}
}
