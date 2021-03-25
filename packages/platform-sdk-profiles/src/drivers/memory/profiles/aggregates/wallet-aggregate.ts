import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { IProfile, IReadWriteWallet, IWalletAggregate } from "../../../../contracts";

type NetworkType = "live" | "test";

export class WalletAggregate implements IWalletAggregate {
	readonly #profile: IProfile;

	public constructor(profile: IProfile) {
		this.#profile = profile;
	}

	public balance(networkType: NetworkType = "live"): BigNumber {
		return this.balancesByNetworkType()[networkType];
	}

	public balancesByNetworkType(): Record<NetworkType, BigNumber> {
		return this.#profile
			.wallets()
			.values()
			.reduce(
				(totals: Record<NetworkType, BigNumber>, wallet: IReadWriteWallet) => {
					const networkType: NetworkType = wallet.network().isLive() ? "live" : "test";

					return {
						...totals,
						[networkType]: totals[networkType].plus(wallet.balance()),
					};
				},
				{
					live: BigNumber.ZERO,
					test: BigNumber.ZERO,
				},
			);
	}

	public convertedBalance(): BigNumber {
		return this.#profile
			.wallets()
			.values()
			.reduce(
				(total: BigNumber, wallet: IReadWriteWallet) => total.plus(wallet.convertedBalance()),
				BigNumber.ZERO,
			);
	}

	public balancePerCoin(networkType: NetworkType = "live"): Record<string, { total: number; percentage: number }> {
		const result = {};

		const totalByProfile: BigNumber = this.balance(networkType);
		const walletsByCoin: Record<string, Record<string, IReadWriteWallet>> = this.#profile.wallets().allByCoin();

		for (const [coin, wallets] of Object.entries(walletsByCoin)) {
			const matchingWallets = Object.values(wallets).filter(
				(wallet: IReadWriteWallet) => wallet.network().isLive() === (networkType === "live"),
			);

			if (matchingWallets.length) {
				const totalByCoin: BigNumber = matchingWallets.reduce(
					(total: BigNumber, wallet: IReadWriteWallet) => total.plus(wallet.balance()),
					BigNumber.ZERO,
				);

				result[coin] = {
					total: totalByCoin.toFixed(),
					percentage: totalByProfile.isZero()
						? "0.00"
						: totalByCoin.divide(totalByProfile).times(100).toFixed(2),
				};
			}
		}

		return result;
	}
}
