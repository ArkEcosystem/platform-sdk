import { Environment } from "@arkecosystem/platform-sdk-profiles";
import Logger from "@ptkdev/logger";
// import { ADA } from "@arkecosystem/platform-sdk-ada";
import { ARK } from "@arkecosystem/platform-sdk-ark";
// import { ATOM } from "@arkecosystem/platform-sdk-atom";
import { AVAX } from "@arkecosystem/platform-sdk-avax";
// import { BTC } from "@arkecosystem/platform-sdk-btc";
// import { DOT } from "@arkecosystem/platform-sdk-dot";
// import { EGLD } from "@arkecosystem/platform-sdk-egld";
// import { EOS } from "@arkecosystem/platform-sdk-eos";
// import { ETH } from "@arkecosystem/platform-sdk-eth";
import { LSK } from "@arkecosystem/platform-sdk-lsk";
// import { NEO } from "@arkecosystem/platform-sdk-neo";
// import { SOL } from "@arkecosystem/platform-sdk-sol";
// import { TRX } from "@arkecosystem/platform-sdk-trx";
// import { XLM } from "@arkecosystem/platform-sdk-xlm";
// import { XRP } from "@arkecosystem/platform-sdk-xrp";
import { Request } from "@arkecosystem/platform-sdk-http-got";
import cfonts from "cfonts";
import { ConfStorage } from "./storage";

export const useLogger = (): Logger => new Logger();

export const useEnvironment = async (): Promise<Environment> => {
	const env = new Environment({
		coins: {
			// ADA,
			ARK,
			// ATOM,
			AVAX,
			// BTC,
			// DOT,
			// EGLD,
			// EOS,
			// ETH,
			LSK,
			// NEO,
			// SOL,
			// TRX,
			// XLM,
			// XRP,
		},
		storage: new ConfStorage(),
		httpClient: new Request(),
	});

	await env.verify();
	await env.boot();

	return env;
};

export const renderLogo = (): void => {
	console.clear();

	cfonts.say("Plutus", {
		gradient: ["#14b8a6", "#0891b2"],
		independentGradient: true,
		transitionGradient: true,
	});
};
