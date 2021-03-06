import { ValidatorSchema } from "@arkecosystem/platform-sdk-support";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().valid("luna.mainnet", "luna.testnet"),
	httpClient: ValidatorSchema.object(),
});
