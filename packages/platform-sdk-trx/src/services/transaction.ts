import { Coins, Contracts, Exceptions, Helpers, Services } from "@arkecosystem/platform-sdk";
import { Coin } from "@arkecosystem/platform-sdk/dist/coins";
import TronWeb from "tronweb";

import { SignedTransactionData } from "../dto";
import { AddressService } from "./identity/address";
import { PrivateKeyService } from "./identity/private-key";

export class TransactionService extends Services.AbstractTransactionService {
	readonly #config: Coins.Config;
	readonly #connection: TronWeb;
	readonly #address: AddressService;
	readonly #privateKey: PrivateKeyService;

	private constructor(config: Coins.Config) {
		super();

		this.#config = config;
		this.#connection = new TronWeb({ fullHost: Helpers.randomHostFromConfig(config) });
		this.#address = new AddressService(config);
		this.#privateKey = new PrivateKeyService(config);
	}

	public static async __construct(config: Coins.Config): Promise<TransactionService> {
		return new TransactionService(config);
	}

	public async transfer(
		input: Services.TransferInput,
		options?: Services.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		try {
			if (input.signatory.signingKey() === undefined) {
				throw new Exceptions.MissingArgument(this.constructor.name, this.transfer.name, "input.signatory");
			}

			const { address: senderAddress } = await this.#address.fromMnemonic(input.signatory.signingKey());

			if (senderAddress === input.data.to) {
				throw new Exceptions.InvalidRecipientException("Cannot transfer TRX to the same account.");
			}

			let transaction = await this.#connection.transactionBuilder.sendTrx(
				input.data.to,
				Helpers.toRawUnit(input.data.amount, this.#config).toString(),
				senderAddress,
				1,
			);

			if (input.data.memo) {
				transaction = await this.#connection.transactionBuilder.addUpdateData(
					transaction,
					input.data.memo,
					"utf8",
				);
			}

			const response = await this.#connection.trx.sign(
				transaction,
				(await this.#privateKey.fromMnemonic(input.signatory.signingKey())).privateKey,
			);

			const decimals = this.#config.get<number>(Coins.ConfigKey.CurrencyDecimals);
			return new SignedTransactionData(response.txID, response, response, decimals);
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}
}
