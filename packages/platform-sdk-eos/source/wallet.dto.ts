import { Contracts, DTO, Exceptions } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public override primaryKey(): string {
		return this.address();
	}

	public override address(): string {
		return this.data.account_name;
	}

	public override publicKey(): string | undefined {
		return undefined;
	}

	public override balance(): Contracts.WalletBalance {
		return {
			available: BigNumber.make(this.data.net_weight),
			fees: BigNumber.make(this.data.net_weight),
		};
	}

	public override nonce(): BigNumber {
		return BigNumber.ZERO;
	}

	public override secondPublicKey(): string | undefined {
		throw new Exceptions.NotImplemented(this.constructor.name, this.secondPublicKey.name);
	}

	public override username(): string | undefined {
		throw new Exceptions.NotImplemented(this.constructor.name, this.username.name);
	}

	public override rank(): number | undefined {
		throw new Exceptions.NotImplemented(this.constructor.name, this.rank.name);
	}

	public override votes(): BigNumber | undefined {
		throw new Exceptions.NotImplemented(this.constructor.name, this.votes.name);
	}

	public multiSignature(): Contracts.WalletMultiSignature {
		throw new Exceptions.NotImplemented(this.constructor.name, this.multiSignature.name);
	}

	public override isDelegate(): boolean {
		return false;
	}

	public override isResignedDelegate(): boolean {
		return false;
	}

	public override isMultiSignature(): boolean {
		return false;
	}

	public override isSecondSignature(): boolean {
		return false;
	}
}
