import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { createProfile, useEnvironment, useLogger } from "../helpers";

export default async () => {
	const logger = useLogger();
	const env: Environment = await useEnvironment();

	// Create profile
	const profile = await createProfile(env,  "stellar-profile", "my-password");

	// Restore it and sync
	await env.profiles().restore(profile, "my-password");
	await profile.sync();

	// Create read-write wallet 1
	const mnemonic1: string = "stand adapt injury old donate champion sword slice exhibit mimic chair body";
	const wallet1 = await profile.walletFactory().fromMnemonic({
		mnemonic: mnemonic1,
		coin: "XLM",
		network: "xlm.testnet"
	});
	profile.wallets().push(wallet1);

	// Display profile and wallet balances
	logger.log("Wallet 1", wallet1.address(), "balance", wallet1.balance().toHuman(2));

	// Show transactions
	const transactions = await wallet1
		.transactions();
	logger.log("transactions", transactions);
};
