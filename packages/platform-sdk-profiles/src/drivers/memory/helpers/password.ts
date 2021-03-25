import { Hash } from "@arkecosystem/platform-sdk-crypto";

import { ProfileContract } from "../profiles/profile.models";

const passwordKey = (profile: ProfileContract): string => Hash.sha256(`${profile.id()}/passwd`).toString("hex");

export class MemoryPassword {
	public static get(profile: ProfileContract): string {
		const password: string | undefined = process.env[passwordKey(profile)];

		if (password === undefined) {
			throw new Error("Failed to find a password for the given profile.");
		}

		return password;
	}

	public static set(profile: ProfileContract, password: string): void {
		process.env[passwordKey(profile)] = password;
	}

	public static forget(profile: ProfileContract): void {
		delete process.env[passwordKey(profile)];
	}
}
