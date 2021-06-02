/* istanbul ignore file */

import { NotImplemented } from "../exceptions";
import { AddressDataTransferObject } from "./address.contract";
import { IdentityOptions } from "./shared.contract";
import { WalletDiscoveryService } from "./wallet-discovery.contract";

export abstract class AbstractWalletDiscoveryService implements WalletDiscoveryService {
	public async fromMnemonic(mnemonic: string, options?: IdentityOptions): Promise<AddressDataTransferObject[]> {
		throw new NotImplemented(this.constructor.name, this.fromMnemonic.name);
	}
}
