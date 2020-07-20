import { Coins } from "@arkecosystem/platform-sdk";
import { Request } from "@arkecosystem/platform-sdk-http-got";

import { manifest } from "../src/manifest";
import { schema } from "../src/schema";

export const createConfig = (options?: object) => {
	const config = new Coins.Config(
		{ ...(options || { network: "ropsten" }), ...{ httpClient: new Request() } },
		schema,
	);

	config.set("network", manifest.networks.ropsten);

	return config;
};
