import { Coins, IoC, Services } from "@arkecosystem/platform-sdk";
import { bech32 } from "bech32";

import { addressFromAccountExtPublicKey, addressFromMnemonic } from "./shelley";

@IoC.injectable()
export class AddressService extends Services.AbstractAddressService {
	@IoC.inject(IoC.BindingType.ConfigRepository)
	protected readonly configRepository!: Coins.ConfigRepository;

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			type: "bip44",
			address: addressFromMnemonic(
				mnemonic,
				options?.bip44?.account || 0,
				false,
				options?.bip44?.addressIndex || 0,
				this.configRepository.get("network.meta.networkId"),
			),
		};
	}

	public override async fromPublicKey(
		publicKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			type: "bip44",
			address: addressFromAccountExtPublicKey(
				Buffer.from(publicKey, "hex"),
				false,
				options?.bip44?.addressIndex || 0,
				this.configRepository.get("network.meta.networkId"),
			),
		};
	}

	public override async validate(address: string): Promise<boolean> {
		try {
			const { words } = bech32.decode(address, 1023);

			return [
				0b0000, // Base
				0b0100, // Pointer
				0b0110, // Enterprise
				0b1110, // Reward
			].includes(words[0] >> 4);
		} catch {
			return false;
		}
	}
}
