import Joi from "joi";

import { baseSchema, makeCoin } from "../helpers";

export const registerBusiness = () => [
	{
		name: "business.withdraw",
		async method({ coin, network, from, to, mnemonic }) {
			const business = await makeCoin({ coin, network });

			const transferFee = (await business.fee().all()).transfer.avg.toHuman();

			const transfer = await business.transaction().transfer({
				data: {
					amount: (await business.client().wallet(from)).balance().available.toHuman() - transferFee,
					to,
				},
				fee: transferFee,
				signatory: await business.signatory().mnemonic(mnemonic),
			});

			const broadcast = await business.client().broadcast([transfer]);

			if (broadcast.rejected.length > 0) {
				return broadcast;
			}

			return {
				id: transfer.id(),
				sender: transfer.sender(),
				recipient: transfer.recipient(),
				amount: transfer.amount().toHuman(),
				fee: transfer.fee().toHuman(),
				timestamp: transfer.timestamp().toISOString(),
			};
		},
		schema: Joi.object({
			...baseSchema,
			from: Joi.string().required(),
			to: Joi.string().required(),
			mnemonic: Joi.string().required(),
		}).required(),
	},
];
