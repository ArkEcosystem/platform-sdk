import { v4 as uuidv4 } from "uuid";
import { IProfile, IProfileFactory, ProfileSetting } from "../../../contracts";
import { Profile } from "./profile";
import { ProfileInitialiser } from "./profile.initialiser";

export class ProfileFactory implements IProfileFactory {
	public static fromName(name: string): IProfile {
		const result: IProfile = new Profile({ id: uuidv4(), name, data: "" });

		new ProfileInitialiser(result).reset(name);

		result.save();

		return result;
	}
}
