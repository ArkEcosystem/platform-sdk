import { Coins } from "@arkecosystem/platform-sdk";

import { transactions, importMethods, featureFlags } from "../shared";

const network: Coins.NetworkManifest = {
	id: "xrp.mainnet",
	type: "live",
	name: "Mainnet",
	coin: "XRP",
	currency: {
		ticker: "XRP",
		symbol: "XRP",
	},
	constants: {
		slip44: 144,
	},
	hosts: [
		{
			type: "full",
			host: "https://s2.ripple.com:51234/",
		},
		{
			type: "explorer",
			host: "https://livenet.xrpl.org/",
		},
	],
	transactions,
	importMethods,
	featureFlags,
};

export default network;
