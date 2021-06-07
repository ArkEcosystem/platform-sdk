import { IoC, Services } from "@arkecosystem/platform-sdk";
import { decodeAddress, encodeAddress, Keyring } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";
import { createKeyMulti } from "@polkadot/util-crypto";

import { BindingType } from "../constants";

@IoC.injectable()
export class AddressService extends Services.AbstractAddressService {
	@IoC.inject(BindingType.Keyring)
	protected readonly keyring!: Keyring;

	public async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			type: "ss58",
			address: this.keyring.addFromMnemonic(mnemonic).address,
		};
	}

	public async fromMultiSignature(min: number, publicKeys: string[]): Promise<Services.AddressDataTransferObject> {
		return {
			type: "ss58",
			address: encodeAddress(createKeyMulti(publicKeys, min), 0),
		};
	}

	public async validate(address: string): Promise<boolean> {
		try {
			encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));

			return true;
		} catch {
			return false;
		}
	}
}
