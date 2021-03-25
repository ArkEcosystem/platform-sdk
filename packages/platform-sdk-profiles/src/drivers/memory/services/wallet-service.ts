import { pqueueSettled } from "../../../helpers/queue";
import { ProfileRepository } from "../repositories/profile-repository";
import { container } from "../../../environment/container";
import { Identifiers } from "../../../environment/container.models";
import { IProfile, IWalletService } from "../../../contracts";
import { injectable } from "inversify";

@injectable()
export class WalletService implements IWalletService {
	public async syncAll(): Promise<void> {
		const promises: (() => Promise<void>)[] = [];

		for (const profile of container.get<ProfileRepository>(Identifiers.ProfileRepository).values()) {
			for (const wallet of profile.wallets().values()) {
				promises.push(() => wallet?.syncIdentity());
				promises.push(() => wallet?.syncVotes());
			}
		}

		await pqueueSettled(promises);
	}

	public async syncByProfile(profile: IProfile): Promise<void> {
		const promises: (() => Promise<void>)[] = [];

		for (const wallet of profile.wallets().values()) {
			promises.push(() => wallet?.syncIdentity());
			promises.push(() => wallet?.syncVotes());
		}

		await pqueueSettled(promises);
	}
}
