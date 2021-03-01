import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Table from "cli-table3";

import { renderLogo } from "../helpers";

const pushTransactions = (table: Table.Table, transactions): void => {
	for (const transaction of transactions) {
		table.push([
			transaction.id(),
			transaction.sender(),
			transaction.recipient(),
			transaction.amount().toHuman(),
			transaction.fee().toHuman(),
		]);
	}
}

export const listTransactions = async (wallet: ReadWriteWallet): Promise<void> => {
	renderLogo();

	const table = new Table({ head: ["ID", "Sender", "Recipient", "Amount", "Fee"] });

	// Get the first page of transactions...
	let transactions = await wallet.transactions({});
	pushTransactions(table, transactions.items());

	// Gather all remaining transactions by looping over all pages...
	while (transactions.isNotEmpty()) {
		transactions = await wallet.transactions({ cursor: transactions.nextPage() });
		pushTransactions(table, transactions.items());
	}

	console.log(table.toString());
};
