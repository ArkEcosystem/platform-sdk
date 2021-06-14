import { Coins, IoC, Services } from "@arkecosystem/platform-sdk";
import { BIP44 } from "@arkecosystem/platform-sdk-crypto";
import TronWeb from "tronweb";

@IoC.injectable()
export class AddressService extends Services.AbstractAddressService {
	@IoC.inject(IoC.BindingType.ConfigRepository)
	protected readonly configRepository!: Coins.ConfigRepository;

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		const { child, path } = BIP44.deriveChildWithPath(mnemonic, {
			coinType: this.configRepository.get(Coins.ConfigKey.Slip44),
			index: options?.bip44?.addressIndex,
		});

		return {
			type: "bip44",
			address: TronWeb.address.fromPrivateKey(child.privateKey!.toString("hex")),
			path,
		};
	}

	public override async validate(address: string): Promise<boolean> {
		return true;
	}
}
