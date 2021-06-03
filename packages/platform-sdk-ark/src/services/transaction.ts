import { Interfaces, Transactions } from "@arkecosystem/crypto";
import { MultiSignatureSigner } from "@arkecosystem/multi-signature";
import { Coins, Contracts, Exceptions, Helpers, Services } from "@arkecosystem/platform-sdk";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { v4 as uuidv4 } from "uuid";

import { Bindings } from "../contracts";
import { SignedTransactionData } from "../dto/signed-transaction";
import { applyCryptoConfiguration } from "./helpers";
import { IdentityService } from "./identity";

export class TransactionService extends Services.AbstractTransactionService {
	readonly #config: Coins.Config;
	readonly #http: Contracts.HttpClient;
	readonly #identity: IdentityService;
	readonly #peer: string;
	readonly #multiSignatureSigner: MultiSignatureSigner;
	readonly #configCrypto: { crypto: Interfaces.NetworkConfig; height: number };

	private constructor({ config, http, identity, peer, multiSignatureSigner, configCrypto }) {
		super();

		this.#config = config;
		this.#http = http;
		this.#identity = identity;
		this.#peer = peer;
		this.#multiSignatureSigner = multiSignatureSigner;
		this.#configCrypto = configCrypto;
	}

	public static async __construct(config: Coins.Config): Promise<TransactionService> {
		const crypto = config.get<Interfaces.NetworkConfig>(Bindings.Crypto);
		const height = config.get<number>(Bindings.Height);

		return new TransactionService({
			config,
			http: config.get<Contracts.HttpClient>(Coins.ConfigKey.HttpClient),
			peer: Helpers.randomHostFromConfig(config),
			identity: await IdentityService.__construct(config),
			multiSignatureSigner: new MultiSignatureSigner(crypto, height),
			configCrypto: { crypto, height },
		});
	}

	public async transfer(
		input: Services.TransferInput,
		options?: Services.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("transfer", input, options, ({ transaction, data }) => {
			transaction.recipientId(data.to);

			if (data.memo) {
				transaction.vendorField(data.memo);
			}
		});
	}

	public async secondSignature(
		input: Services.SecondSignatureInput,
		options?: Services.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("secondSignature", input, options, ({ transaction, data }) =>
			transaction.signatureAsset(BIP39.normalize(data.mnemonic)),
		);
	}

	public async delegateRegistration(
		input: Services.DelegateRegistrationInput,
		options?: Services.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("delegateRegistration", input, options, ({ transaction, data }) =>
			transaction.usernameAsset(data.username),
		);
	}

	public async vote(
		input: Services.VoteInput,
		options?: Services.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("vote", input, options, ({ transaction, data }) => {
			const votes: string[] = [];

			if (Array.isArray(data.unvotes)) {
				for (const unvote of data.unvotes) {
					votes.push(`-${unvote}`);
				}
			}

			if (Array.isArray(data.votes)) {
				for (const vote of data.votes) {
					votes.push(`+${vote}`);
				}
			}

			transaction.votesAsset(votes);
		});
	}

	public async multiSignature(
		input: Services.MultiSignatureInput,
		options?: Services.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("multiSignature", input, options, ({ transaction, data }) => {
			transaction.multiSignatureAsset({
				publicKeys: data.publicKeys,
				min: data.min,
			});

			transaction.senderPublicKey(data.senderPublicKey);
		});
	}

	public async ipfs(
		input: Services.IpfsInput,
		options?: Services.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("ipfs", input, options, ({ transaction, data }) => transaction.ipfsAsset(data.hash));
	}

	public async multiPayment(
		input: Services.MultiPaymentInput,
		options?: Services.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("multiPayment", input, options, ({ transaction, data }) => {
			for (const payment of data.payments) {
				transaction.addPayment(payment.to, Coins.toRawUnit(payment.amount, this.#config).toString());
			}

			if (data.memo) {
				transaction.vendorField(data.memo);
			}
		});
	}

	public async delegateResignation(
		input: Services.DelegateResignationInput,
		options?: Services.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("delegateResignation", input, options);
	}

	public async htlcLock(
		input: Services.HtlcLockInput,
		options?: Services.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("htlcLock", input, options, ({ transaction, data }) => {
			transaction.amount(Coins.toRawUnit(data.amount, this.#config).toString());

			transaction.recipientId(data.to);

			transaction.htlcLockAsset({
				secretHash: data.secretHash,
				expiration: data.expiration,
			});
		});
	}

	public async htlcClaim(
		input: Services.HtlcClaimInput,
		options?: Services.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("htlcClaim", input, options, ({ transaction, data }) =>
			transaction.htlcClaimAsset({
				lockTransactionId: data.lockTransactionId,
				unlockSecret: data.unlockSecret,
			}),
		);
	}

	public async htlcRefund(
		input: Services.HtlcRefundInput,
		options?: Services.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("htlcRefund", input, options, ({ transaction, data }) =>
			transaction.htlcRefundAsset({
				lockTransactionId: data.lockTransactionId,
			}),
		);
	}

	/**
	 * This method should be used to split-sign transactions in combination with the MuSig Server.
	 *
	 * @param transaction A transaction that was previously signed with a multi-signature.
	 * @param input
	 */
	public async multiSign(
		transaction: Contracts.RawTransactionData,
		input: Services.TransactionInputs,
	): Promise<Contracts.SignedTransactionData> {
		applyCryptoConfiguration(this.#configCrypto);

		let keys: Services.KeyPairDataTransferObject | undefined;

		if (input.signatory.actsWithMnemonic()) {
			keys = await this.#identity.keyPair().fromMnemonic(input.signatory.signingKey());
		}

		if (input.signatory.actsWithWif()) {
			keys = await this.#identity.keyPair().fromWIF(input.signatory.signingKey());
		}

		if (!keys) {
			throw new Error("Failed to retrieve the keys for the signatory wallet.");
		}

		const transactionWithSignature = this.#multiSignatureSigner.addSignature(transaction, {
			publicKey: keys.publicKey,
			privateKey: keys.privateKey,
			compressed: true,
		});

		return new SignedTransactionData(
			transactionWithSignature.id!,
			transactionWithSignature,
			transactionWithSignature,
		);
	}

	public async estimateExpiration(value?: string): Promise<string | undefined> {
		const { data: blockchain } = (await this.#http.get(`${this.#peer}/blockchain`)).json();
		const { data: configuration } = (await this.#http.get(`${this.#peer}/node/configuration`)).json();

		return BigNumber.make(blockchain.block.height)
			.plus(value || 5 * configuration.constants.activeDelegates)
			.toString();
	}

	async #createFromData(
		type: string,
		input: Services.TransactionInputs,
		options?: Services.TransactionOptions,
		callback?: Function,
	): Promise<Contracts.SignedTransactionData> {
		applyCryptoConfiguration(this.#configCrypto);

		try {
			let address: string | undefined;

			if (input.signatory.actsWithMnemonic() || input.signatory.actsWithPrivateMultiSignature()) {
				address = (await this.#identity.address().fromMnemonic(input.signatory.signingKey())).address;
			}

			if (input.signatory.actsWithWif()) {
				address = (await this.#identity.address().fromWIF(input.signatory.signingKey())).address;
			}

			const transaction = Transactions.BuilderFactory[type]().version(2);

			if (input.signatory.actsWithSenderPublicKey()) {
				address = input.signatory.address();

				transaction.senderPublicKey(input.signatory.signingKey());
			}

			if (input.signatory.actsWithSignature()) {
				address = (await this.#identity.address().fromPublicKey(input.signatory.publicKey())).address;

				transaction.senderPublicKey(input.signatory.publicKey());
			}

			if (input.nonce) {
				transaction.nonce(input.nonce);
			} else {
				const { data } = (await this.#http.get(`${this.#peer}/wallets/${address}`)).json();

				transaction.nonce(BigNumber.make(data.nonce).plus(1).toFixed());
			}

			if (input.data && input.data.amount) {
				transaction.amount(Coins.toRawUnit(input.data.amount, this.#config).toString());
			}

			if (input.fee) {
				transaction.fee(Coins.toRawUnit(input.fee, this.#config).toString());
			}

			if (input.data && input.data.expiration) {
				transaction.expiration(input.data.expiration);
			} else {
				try {
					const estimatedExpiration = await this.estimateExpiration();

					if (estimatedExpiration) {
						transaction.expiration(parseInt(estimatedExpiration));
					}
				} catch {
					// If we fail to estimate the expiration we'll still continue.
				}
			}

			if (callback) {
				callback({ transaction, data: input.data });
			}

			if (options && options.unsignedJson === true) {
				return transaction.toJson();
			}

			if (options && options.unsignedBytes === true) {
				const signedTransaction = Transactions.Serializer.getBytes(transaction.data, {
					excludeSignature: true,
					excludeSecondSignature: true,
				}).toString("hex");

				return new SignedTransactionData(uuidv4(), signedTransaction, signedTransaction);
			}

			if (input.signatory.actsWithMultiSignature()) {
				const transactionWithSignature = this.#multiSignatureSigner.sign(
					transaction,
					input.signatory.signingList(),
				);

				return new SignedTransactionData(
					transactionWithSignature.id!,
					transactionWithSignature,
					transactionWithSignature,
				);
			}

			const actsWithMultiMnemonic =
				input.signatory.actsWithMultiMnemonic() || input.signatory.actsWithPrivateMultiSignature();

			if (actsWithMultiMnemonic && Array.isArray(input.signatory.signingKeys())) {
				const signingKeys: string[] = input.signatory.signingKeys();

				const senderPublicKeys: string[] = (
					await Promise.all(
						signingKeys.map((mnemonic: string) => this.#identity.publicKey().fromMnemonic(mnemonic)),
					)
				).map(({ publicKey }) => publicKey);

				transaction.senderPublicKey(
					(await this.#identity.publicKey().fromMultiSignature(signingKeys.length, senderPublicKeys))
						.publicKey,
				);

				for (let i = 0; i < signingKeys.length; i++) {
					transaction.multiSign(signingKeys[i], i);
				}
			} else if (input.signatory.actsWithSignature()) {
				transaction.data.signature = input.signatory.signingKey();
			} else {
				if (input.signatory.actsWithMnemonic()) {
					transaction.sign(input.signatory.signingKey());
				}

				if (input.signatory.actsWithSecondaryMnemonic()) {
					transaction.sign(input.signatory.signingKey());
					transaction.secondSign(input.signatory.confirmKey());
				}

				if (input.signatory.actsWithWif()) {
					transaction.signWithWif(input.signatory.signingKey());
				}

				if (input.signatory.actsWithSecondaryWif()) {
					transaction.signWithWif(input.signatory.signingKey());
					transaction.secondSignWithWif(input.signatory.confirmKey());
				}
			}

			const signedTransaction = transaction.build().toJson();

			return new SignedTransactionData(signedTransaction.id, signedTransaction, signedTransaction);
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}
}
