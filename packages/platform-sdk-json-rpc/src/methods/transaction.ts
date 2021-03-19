import { Coins } from "@arkecosystem/platform-sdk";
import Joi from "joi";

export const registerTransaction = (coin: Coins.Coin) => [
	{
		name: "transaction.transfer",
		async method(input) {
			const signedTransaction = await coin.transaction().transfer(input);

			return {
				id: signedTransaction.id(),
				data: signedTransaction.toBroadcast(),
			};
		},
		schema: Joi.object({
			// Specific
			data: Joi.object({
				amount: Joi.string().required(),
				to: Joi.string().required(),
				memo: Joi.string(),
				expiration: Joi.number(),
			}),
			// Shared
			fee: Joi.string(),
			feeLimit: Joi.string(),
			nonce: Joi.string(),
			from: Joi.string(),
			sign: Joi.object({
				mnemonic: Joi.string(),
				mnemonics: Joi.array().items(Joi.string()),
				secondMnemonic: Joi.string(),
				wif: Joi.string(),
				secondWif: Joi.string(),
				privateKey: Joi.string(),
				multiSignature: Joi.object({
					min: Joi.number(),
					publicKeys: Joi.array().items(Joi.string()),
				}),
				senderPublicKey: Joi.string(),
				signature: Joi.string(),
			}),
			contract: Joi.object({
				address: Joi.string(),
			}),
		}).required(),
	},
];
