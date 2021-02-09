import ArkDevnet from "./networks/ark/devnet";
import ArkMainnet from "./networks/ark/mainnet";
import CompendiaMainnet from "./networks/compendia/mainnet";

export const manifest = {
	name: "ARK",
	networks: {
		"ark.mainnet": ArkMainnet,
		"ark.devnet": ArkDevnet,
		"compendia.mainnet": CompendiaMainnet,
	},
};
