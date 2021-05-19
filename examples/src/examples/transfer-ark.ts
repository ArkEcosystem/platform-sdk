import { Signatories } from "@arkecosystem/platform-sdk";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { createProfile, pollTransactionStatus, useEnvironment, useLogger } from "../helpers";

export default async () => {
	const logger = useLogger();
	const env: Environment = await useEnvironment();

	// Create profile
	const profile = await createProfile(env,  "ark-profile", "my-password");

	// Restore it and sync
	await env.profiles().restore(profile, "my-password");
	await profile.sync();

	// Create read-write wallet #1
	const mnemonic1: string = "super secure password";
	const wallet1 = await profile.walletFactory().fromMnemonic({
		mnemonic: mnemonic1,
		coin: "ARK",
		network: "ark.testnet"
	});
	profile.wallets().push(wallet1);

	// Create read-only wallet #2
	const address2 = "ATsPMTAHNsUwKedzNpjTNRfcj1oRGaX5xC";
	const wallet2 = await profile.walletFactory().fromAddress({
		address: address2,
		coin: "ARK",
		network: "ark.testnet"
	});
	profile.wallets().push(wallet2);

	// Display profile and wallet balances
	logger.log("Wallet 1", wallet1.address(), "balance", wallet1.balance().toHuman(2));
	logger.log("Wallet 2", wallet2.address(), "balance", wallet2.balance().toHuman(2));


	const transactionId = await wallet1
		.transaction()
		.signTransfer({
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory(
					mnemonic1,
					wallet1.address(),
				),
			),
			data: {
				amount: "100000000",
				to: address2
			}
		});
	logger.log("signedTransactionData", transactionId);

	await wallet1.transaction().broadcast(transactionId);
	await pollTransactionStatus(transactionId, wallet1);
};
