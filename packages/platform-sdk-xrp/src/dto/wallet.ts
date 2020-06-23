import { Contracts, DTO, Exceptions } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public address(): string {
		return this.data.account;
	}

	public publicKey(): string {
		throw new Exceptions.NotImplemented(this.constructor.name, "publicKey");
	}

	public balance(): BigNumber {
		return BigNumber.make(this.data.balance * 1e8);
	}

	public nonce(): BigNumber {
		return BigNumber.ZERO;
	}

	public username(): string | undefined {
		throw new Exceptions.NotImplemented(this.constructor.name, "username");
	}

	public rank(): number | undefined {
		throw new Exceptions.NotImplemented(this.constructor.name, "rank");
	}

	public votes(): BigNumber | undefined {
		throw new Exceptions.NotImplemented(this.constructor.name, "votes");
	}
}
