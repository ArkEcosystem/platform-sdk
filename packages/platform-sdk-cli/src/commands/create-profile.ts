import { Environment } from "@arkecosystem/platform-sdk-profiles";
import prompts from "prompts";

import { renderLogo } from "../helpers";
import { validatePassword } from "./change-password";

export const createProfile = async (env: Environment): Promise<void> => {
	renderLogo();

	const { name, password } = await prompts([
		{
			type: "text",
			name: "name",
			message: "What is your name?",
			validate: (value: string) => value && env.profiles().findByName(value) === undefined,
		},
		{
			type: "password",
			name: "password",
			message: "What is your password? (Optional)",
			validate: async (value: string) => {
				if (!value) {
					return true;
				}

				return validatePassword(value);
			},
		},
	]);

	if (name === undefined) {
		return;
	}

	const profile = env.profiles().create(name);

	if (password !== undefined) {
		profile.auth().setPassword(password);
	}

	await env.persist();
};
