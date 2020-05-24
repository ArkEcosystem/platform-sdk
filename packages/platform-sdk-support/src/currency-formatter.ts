import { BigNumber, NumberLike } from "./bignumber";

export class CurrencyFormatter {
	// todo: implement generic formatting method
	// https://github.com/ArkEcosystem/desktop-wallet/blob/develop/src/renderer/mixins/currency.js#L7-L100

	public static simpleFormatCrypto(value: NumberLike, token: string): string {
		return `${value} ${token}`;
	}

	public static toBuilder(value: NumberLike, decimals = 8): BigNumber {
		return BigNumber.make(value, decimals);
	}

	public static subToUnit(value: NumberLike, decimals = 8): BigNumber {
		return BigNumber.make(value, decimals).divide(1e8);
	}

	public static unitToSub(value: NumberLike, decimals = 8): BigNumber {
		return BigNumber.make(value, decimals).toSatoshi();
	}

	public static cryptoToCurrency(
		value: NumberLike,
		price: NumberLike,
		options: { fromSubUnit: boolean; decimals: number } = {
			fromSubUnit: true,
			decimals: 2,
		},
	): string {
		return (options.fromSubUnit ? this.subToUnit(value) : BigNumber.make(value))
			.decimalPlaces(options.decimals)
			.times(price)
			.toFixed();
	}
}
