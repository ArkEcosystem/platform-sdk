import { Coins, Contracts, Exceptions } from "@arkecosystem/platform-sdk";
import { Arr } from "@arkecosystem/platform-sdk-support";
import { RippleAPI } from "ripple-lib";

import { TransactionData, WalletData } from "../dto";

export class ClientService implements Contracts.ClientService {
	readonly #connection: RippleAPI;
	readonly #dataUrl: string = "https://data.ripple.com/v2";

	readonly #broadcastErrors: Record<string, string> = {
		tecCLAIM: "ERR_CLAIM",
		tecCRYPTOCONDITION_ERROR: "ERR_CRYPTOCONDITION_ERROR",
		tecDIR_FULL: "ERR_DIR_FULL",
		tecDST_TAG_NEEDED: "ERR_DST_TAG_NEEDED",
		tecDUPLICATE: "ERR_DUPLICATE",
		tecEXPIRED: "ERR_EXPIRED",
		tecFAILED_PROCESSING: "ERR_FAILED_PROCESSING",
		tecFROZEN: "ERR_FROZEN",
		tecHAS_OBLIGATIONS: "ERR_HAS_OBLIGATIONS",
		tecINSUF_RESERVE_LINE: "ERR_INSUF_RESERVE_LINE",
		tecINSUF_RESERVE_OFFER: "ERR_INSUF_RESERVE_OFFER",
		tecINSUFF_FEE: "ERR_INSUFF_FEE",
		tecINSUFFICIENT_RESERVE: "ERR_INSUFFICIENT_RESERVE",
		tecINTERNAL: "ERR_INTERNAL",
		tecINVARIANT_FAILED: "ERR_INVARIANT_FAILED",
		tecKILLED: "ERR_KILLED",
		tecNEED_MASTER_KEY: "ERR_NEED_MASTER_KEY",
		tecNO_ALTERNATIVE_KEY: "ERR_NO_ALTERNATIVE_KEY",
		tecNO_AUTH: "ERR_NO_AUTH",
		tecNO_DST_INSUF_XRP: "ERR_NO_DST_INSUF_XRP",
		tecNO_DST: "ERR_NO_DST",
		tecNO_ENTRY: "ERR_NO_ENTRY",
		tecNO_ISSUER: "ERR_NO_ISSUER",
		tecNO_LINE_INSUF_RESERVE: "ERR_NO_LINE_INSUF_RESERVE",
		tecNO_LINE_REDUNDANT: "ERR_NO_LINE_REDUNDANT",
		tecNO_LINE: "ERR_NO_LINE",
		tecNO_PERMISSION: "ERR_NO_PERMISSION",
		tecNO_REGULAR_KEY: "ERR_NO_REGULAR_KEY",
		tecNO_TARGET: "ERR_NO_TARGET",
		tecOVERSIZE: "ERR_OVERSIZE",
		tecOWNERS: "ERR_OWNERS",
		tecPATH_DRY: "ERR_PATH_DRY",
		tecPATH_PARTIAL: "ERR_PATH_PARTIAL",
		tecTOO_SOON: "ERR_TOO_SOON",
		tecUNFUNDED_ADD: "ERR_UNFUNDED_ADD",
		tecUNFUNDED_OFFER: "ERR_UNFUNDED_OFFER",
		tecUNFUNDED_PAYMENT: "ERR_UNFUNDED_PAYMENT",
		tecUNFUNDED: "ERR_UNFUNDED",
		tefALREADY: "ERR_ALREADY",
		tefBAD_ADD_AUTH: "ERR_BAD_ADD_AUTH",
		tefBAD_AUTH_MASTER: "ERR_BAD_AUTH_MASTER",
		tefBAD_AUTH: "ERR_BAD_AUTH",
		tefBAD_LEDGER: "ERR_BAD_LEDGER",
		tefBAD_QUORUM: "ERR_BAD_QUORUM",
		tefBAD_SIGNATURE: "ERR_BAD_SIGNATURE",
		tefCREATED: "ERR_CREATED",
		tefEXCEPTION: "ERR_EXCEPTION",
		tefFAILURE: "ERR_FAILURE",
		tefINTERNAL: "ERR_INTERNAL",
		tefINVARIANT_FAILED: "ERR_INVARIANT_FAILED",
		tefMASTER_DISABLED: "ERR_MASTER_DISABLED",
		tefMAX_LEDGER: "ERR_MAX_LEDGER",
		tefNO_AUTH_REQUIRED: "ERR_NO_AUTH_REQUIRED",
		tefNOT_MULTI_SIGNING: "ERR_NOT_MULTI_SIGNING",
		tefPAST_SEQ: "ERR_PAST_SEQ",
		tefTOO_BIG: "ERR_TOO_BIG",
		tefWRONG_PRIOR: "ERR_WRONG_PRIOR",
		telBAD_DOMAIN: "ERR_BAD_DOMAIN",
		telBAD_PATH_COUNT: "ERR_BAD_PATH_COUNT",
		telBAD_PUBLIC_KEY: "ERR_BAD_PUBLIC_KEY",
		telCAN_NOT_QUEUE_BALANCE: "ERR_CAN_NOT_QUEUE_BALANCE",
		telCAN_NOT_QUEUE_BLOCKED: "ERR_CAN_NOT_QUEUE_BLOCKED",
		telCAN_NOT_QUEUE_BLOCKS: "ERR_CAN_NOT_QUEUE_BLOCKS",
		telCAN_NOT_QUEUE_FEE: "ERR_CAN_NOT_QUEUE_FEE",
		telCAN_NOT_QUEUE_FULL: "ERR_CAN_NOT_QUEUE_FULL",
		telCAN_NOT_QUEUE: "ERR_CAN_NOT_QUEUE",
		telFAILED_PROCESSING: "ERR_FAILED_PROCESSING",
		telINSUF_FEE_P: "ERR_INSUF_FEE_P",
		telLOCAL_ERROR: "ERR_LOCAL_ERROR",
		telNO_DST_PARTIAL: "ERR_NO_DST_PARTIAL",
		temBAD_AMOUNT: "ERR_BAD_AMOUNT",
		temBAD_CURRENCY: "ERR_BAD_CURRENCY",
		temBAD_EXPIRATION: "ERR_BAD_EXPIRATION",
		temBAD_FEE: "ERR_BAD_FEE",
		temBAD_ISSUER: "ERR_BAD_ISSUER",
		temBAD_LIMIT: "ERR_BAD_LIMIT",
		temBAD_OFFER: "ERR_BAD_OFFER",
		temBAD_PATH_LOOP: "ERR_BAD_PATH_LOOP",
		temBAD_PATH: "ERR_BAD_PATH",
		temBAD_QUORUM: "ERR_BAD_QUORUM",
		temBAD_REGKEY: "ERR_BAD_REGKEY",
		temBAD_SEND_XRP_LIMIT: "ERR_BAD_SEND_XRP_LIMIT",
		temBAD_SEND_XRP_MAX: "ERR_BAD_SEND_XRP_MAX",
		temBAD_SEND_XRP_NO_DIRECT: "ERR_BAD_SEND_XRP_NO_DIRECT",
		temBAD_SEND_XRP_PARTIAL: "ERR_BAD_SEND_XRP_PARTIAL",
		temBAD_SEND_XRP_PATHS: "ERR_BAD_SEND_XRP_PATHS",
		temBAD_SEQUENCE: "ERR_BAD_SEQUENCE",
		temBAD_SIGNATURE: "ERR_BAD_SIGNATURE",
		temBAD_SIGNER: "ERR_BAD_SIGNER",
		temBAD_SRC_ACCOUNT: "ERR_BAD_SRC_ACCOUNT",
		temBAD_TICK_SIZE: "ERR_BAD_TICK_SIZE",
		temBAD_TRANSFER_RATE: "ERR_BAD_TRANSFER_RATE",
		temBAD_WEIGHT: "ERR_BAD_WEIGHT",
		temCANNOT_PREAUTH_SELF: "ERR_CANNOT_PREAUTH_SELF",
		temDISABLED: "ERR_DISABLED",
		temDST_IS_SRC: "ERR_DST_IS_SRC",
		temDST_NEEDED: "ERR_DST_NEEDED",
		temINVALID_ACCOUNT_ID: "ERR_INVALID_ACCOUNT_ID",
		temINVALID_FLAG: "ERR_INVALID_FLAG",
		temINVALID: "ERR_INVALID",
		temMALFORMED: "ERR_MALFORMED",
		temREDUNDANT: "ERR_REDUNDANT",
		temRIPPLE_EMPTY: "ERR_RIPPLE_EMPTY",
		temUNCERTAIN: "ERR_UNCERTAIN",
		temUNKNOWN: "ERR_UNKNOWN",
		terFUNDS_SPENT: "ERR_FUNDS_SPENT",
		terINSUF_FEE_B: "ERR_INSUF_FEE_B",
		terLAST: "ERR_LAST",
		terNO_ACCOUNT: "ERR_NO_ACCOUNT",
		terNO_AUTH: "ERR_NO_AUTH",
		terNO_LINE: "ERR_NO_LINE",
		terNO_RIPPLE: "ERR_NO_RIPPLE",
		terOWNERS: "ERR_OWNERS",
		terPRE_SEQ: "ERR_PRE_SEQ",
		terQUEUED: "ERR_QUEUED",
		terRETRY: "ERR_RETRY",
		tesSUCCESS: "ERR_SUCCESS",
	};

	private constructor(connection: RippleAPI) {
		this.#connection = connection;
	}

	public static async construct(config: Coins.Config): Promise<ClientService> {
		let connection: RippleAPI;
		try {
			connection = new RippleAPI({ server: config.get<string>("peer") });
		} catch {
			connection = new RippleAPI({
				server: Arr.randomElement(config.get<Coins.CoinNetwork>("network").hosts),
			});
		}

		await connection.connect();

		return new ClientService(connection);
	}

	public async destruct(): Promise<void> {
		await this.#connection.disconnect();
	}

	public async transaction(id: string): Promise<Contracts.TransactionData> {
		const transaction = await this.#connection.getTransaction(id);

		return new TransactionData(transaction);
	}

	public async transactions(
		query: Contracts.ClientTransactionsInput,
	): Promise<Contracts.CollectionResponse<Coins.TransactionDataCollection>> {
		const transactions = await this.#connection.getTransactions(query.address!, {
			earliestFirst: true,
			types: ["payment"],
			limit: query.limit || 100,
			// includeRawTransactions: true,
		});

		console.log(transactions);

		return {
			meta: {
				prev: undefined,
				next: undefined,
			},
			data: new Coins.TransactionDataCollection(
				transactions
					// @ts-ignore
					.filter((transaction) => transaction.specification.source.maxAmount.currency === "XRP")
					.map((transaction) => new TransactionData(transaction)),
			),
		};
	}

	public async wallet(id: string): Promise<Contracts.WalletData> {
		const wallet = await this.#connection.getAccountInfo(id);

		return new WalletData({ account: id, balance: wallet.xrpBalance });
	}

	public async wallets(
		query: Contracts.ClientWalletsInput,
	): Promise<Contracts.CollectionResponse<Coins.WalletDataCollection>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "wallets");
	}

	public async delegate(id: string): Promise<Contracts.WalletData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "delegate");
	}

	public async delegates(
		query?: Contracts.KeyValuePair,
	): Promise<Contracts.CollectionResponse<Coins.WalletDataCollection>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "delegates");
	}

	public async votes(
		id: string,
		query?: Contracts.KeyValuePair,
	): Promise<Contracts.CollectionResponse<Coins.TransactionDataCollection>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "votes");
	}

	public async voters(
		id: string,
		query?: Contracts.KeyValuePair,
	): Promise<Contracts.CollectionResponse<Coins.WalletDataCollection>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "voters");
	}

	public async syncing(): Promise<boolean> {
		throw new Exceptions.NotImplemented(this.constructor.name, "syncing");
	}

	public async broadcast(transactions: Contracts.SignedTransaction[]): Promise<Contracts.BroadcastResponse> {
		const result: Contracts.BroadcastResponse = {
			accepted: [],
			rejected: [],
			errors: {},
		};

		for (const transaction of transactions) {
			try {
				// @ts-ignore
				const { engine_result, tx_json } = await this.#connection.submit(transaction);

				const transactionId: string = tx_json.hash;

				if (engine_result === "tesSUCCESS") {
					result.accepted.push(transactionId);
				}
			} catch (error) {
				const transactionId: string = transaction; // todo: get the transaction ID

				const { engine_result } = error.data;

				if (engine_result !== "tesSUCCESS") {
					result.rejected.push(transactionId);

					if (!Array.isArray(result.errors[transactionId])) {
						result.errors[transactionId] = [];
					}

					result.errors[transactionId].push(this.#broadcastErrors[engine_result]);
				}
			}
		}

		return result;
	}
}
