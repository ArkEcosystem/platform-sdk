/* istanbul ignore file */

import { NotImplemented } from "../exceptions";
import { PrivateKeyDataTransferObject, PrivateKeyService } from "./private-key.contract";
import { IdentityOptions } from "./shared.contract";

export abstract class AbstractPrivateKeyService implements PrivateKeyService {
	public async fromMnemonic(mnemonic: string, options?: IdentityOptions): Promise<PrivateKeyDataTransferObject> {
		throw new NotImplemented(this.constructor.name, "fromMultiSignature");
	}

	public async fromWIF(wif: string): Promise<PrivateKeyDataTransferObject> {
		throw new NotImplemented(this.constructor.name, "fromWIF");
	}

	public async fromSecret(secret: string): Promise<PrivateKeyDataTransferObject> {
		throw new NotImplemented(this.constructor.name, "fromSecret");
	}
}
