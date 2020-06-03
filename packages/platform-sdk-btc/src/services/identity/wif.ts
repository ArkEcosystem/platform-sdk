import { Contracts } from "@arkecosystem/platform-sdk";
import { BIP44 } from "@arkecosystem/platform-sdk-crypto";

export class WIF implements Contracts.WIF {
	public async fromMnemonic(mnemonic: string): Promise<string> {
		return BIP44.deriveMasterKey(mnemonic).toWIF();
	}
}
