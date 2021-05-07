import { Contracts, Environment } from "@arkecosystem/platform-sdk-profiles";
import { useEnvironment, useLogger } from "../helpers";

export default async () => {
	const logger = useLogger();
	const env: Environment = await useEnvironment();

	// Open profile
	const profile: Contracts.IProfile | undefined = env.profiles().findByName("my-profile-name");
	if (!profile) {
		throw Error("Profile doesn't exist");
	}

	profile.password().set("my-password");
	await env.profiles().restore(profile, "my-password");
	await profile.sync();

	// Display profile and wallet balances
	logger.log("Profile balance", profile.balance().toHuman(2));
	for (const wallet of Object.values(await profile.wallets().all())) {
		logger.log("Wallet", wallet.address(), "balance", wallet.balance().toHuman(2));
	}

	for (const contact of Object.values(await profile.contacts().all())) {
		logger.log("Contact", contact.name());
	}
};
