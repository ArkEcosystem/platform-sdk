import { ValidatorSchema } from "@arkecosystem/platform-sdk-support";

export const schema = ValidatorSchema.object({
	network: ValidatorSchema.string().allow("xrp.mainnet", "xrp.testnet"),
	peer: ValidatorSchema.string(),
	httpClient: ValidatorSchema.object(),
	services: ValidatorSchema.object({
			ledger: ValidatorSchema.object({
				transport: ValidatorSchema.any(),
			}),
		})
		.default(undefined),
});
