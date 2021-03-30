import { Contracts } from "@arkecosystem/platform-sdk";
import { DateTime } from "@arkecosystem/platform-sdk-intl";

/**
 * Implements a transformer for historical volume data.
 *
 * @export
 * @class HistoricalVolumeTransformer
 * @implements {Contracts.HistoricalTransformer}
 */
export class HistoricalVolumeTransformer implements Contracts.HistoricalTransformer {
	/**
	 * Creates an instance of HistoricalVolumeTransformer.
	 *
	 * @param {Contracts.KeyValuePair} data
	 * @memberof HistoricalVolumeTransformer
	 */
	public constructor(private readonly data: Contracts.KeyValuePair) {}

	/**
	 * Transforms the given data into a normalised format.
	 *
	 * @param {Contracts.KeyValuePair} options
	 * @returns {Contracts.HistoricalData}
	 * @memberof HistoricalVolumeTransformer
	 */
	public transform(options: Contracts.KeyValuePair): Contracts.HistoricalData {
		const datasets = {};

		for (let i = 0; i < this.data.total_volumes.length; i += 24) {
			datasets[this.data.total_volumes[i][0]] = this.data.total_volumes[i][1];
		}

		const datasetValues: number[] = Object.values(datasets);

		return {
			labels: Object.keys(datasets).map((time) => DateTime.make(time).format(options.dateFormat)),
			datasets: datasetValues,
			min: Math.min(...datasetValues),
			max: Math.max(...datasetValues),
		};
	}
}
