import "jest-extended";

import Joi from "joi";

import { ConfigRepository } from "../coins";
import { BindingType, Container } from "../ioc";
import { BigNumberService } from "./big-number.service";

test.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])("#make(%s)", async (power) => {
	const container = new Container();

	container.constant(BindingType.ConfigRepository, new ConfigRepository(
		{
			network: {
				currency: {
					decimals: power,
				},
			},
		},
		Joi.object({
			network: Joi.object({
				currency: Joi.object({
					decimals: Joi.number(),
				}),
			}),
		}),
	));

	expect(container.resolve(BigNumberService).make(`1${"0".repeat(power)}`).toHuman()).toBe("1");
});
