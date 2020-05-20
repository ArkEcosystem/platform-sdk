import { Coins, Contracts, Exceptions, Utils } from "@arkecosystem/platform-sdk";
import BigNumber from "bignumber.js";
import { Transaction } from "bitcore-lib";

import { UnspentTransaction } from "../contracts";
import { UnspentAggregator } from "../utils/unspent-aggregator";
import { IdentityService } from "./identity";

export class TransactionService implements Contracts.TransactionService {
	readonly #identity;
	readonly #unspent;

	private constructor(opts: Contracts.KeyValuePair) {
		this.#identity = opts.identity;
		this.#unspent = opts.unspent;
	}

	public static async construct(config: Coins.Config): Promise<TransactionService> {
		let unspent: UnspentAggregator;
		try {
			unspent = new UnspentAggregator(config.get<string>("peer"));
		} catch {
			unspent = new UnspentAggregator(Utils.randomArrayElement(config.get<Coins.CoinNetwork>("network").hosts));
		}

		return new TransactionService({
			identity: await IdentityService.construct(config),
			unspent,
		});
	}

	public async destruct(): Promise<void> {
		//
	}

	public async transfer(
		input: Contracts.TransferInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransaction> {
		// NOTE: this is a WIF/PrivateKey - should probably be passed in as wif instead of passphrase
		const passphrase: string = Utils.BIP39.normalize(input.sign.passphrase);

		// 1. Derive the sender address
		const senderAddress: string = await this.#identity.address().fromWIF(passphrase);
		// ({ wif: input.sign.passphrase });

		// 2. Aggregate the unspent transactions
		const unspent: UnspentTransaction[] = await this.#unspent.aggregate(senderAddress);

		// 3. Compute the amount to be transfered
		const amount: number = new BigNumber(input.data.amount).toNumber();

		// 4. Build and sign the transaction
		let transaction = new Transaction().from(unspent).to(input.data.to, amount).change(senderAddress);

		// 5. Set a fee if configured. If none is set the fee will be estimated by bitcore-lib.
		if (input.fee) {
			transaction = transaction.fee(input.fee);
		}

		return transaction.sign(passphrase).toString();
	}

	public async secondSignature(
		input: Contracts.SecondSignatureInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransaction> {
		throw new Exceptions.NotImplemented(this.constructor.name, "secondSignature");
	}

	public async delegateRegistration(
		input: Contracts.DelegateRegistrationInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransaction> {
		throw new Exceptions.NotImplemented(this.constructor.name, "delegateRegistration");
	}

	public async vote(
		input: Contracts.VoteInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransaction> {
		throw new Exceptions.NotImplemented(this.constructor.name, "vote");
	}

	public async multiSignature(
		input: Contracts.MultiSignatureInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransaction> {
		throw new Exceptions.NotImplemented(this.constructor.name, "multiSignature");
	}

	public async ipfs(
		input: Contracts.IpfsInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransaction> {
		throw new Exceptions.NotImplemented(this.constructor.name, "ipfs");
	}

	public async multiPayment(
		input: Contracts.MultiPaymentInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransaction> {
		throw new Exceptions.NotImplemented(this.constructor.name, "multiPayment");
	}

	public async delegateResignation(
		input: Contracts.DelegateResignationInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransaction> {
		throw new Exceptions.NotImplemented(this.constructor.name, "delegateResignation");
	}

	public async htlcLock(
		input: Contracts.HtlcLockInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransaction> {
		throw new Exceptions.NotImplemented(this.constructor.name, "htlcLock");
	}

	public async htlcClaim(
		input: Contracts.HtlcClaimInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransaction> {
		throw new Exceptions.NotImplemented(this.constructor.name, "htlcClaim");
	}

	public async htlcRefund(
		input: Contracts.HtlcRefundInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransaction> {
		throw new Exceptions.NotImplemented(this.constructor.name, "htlcRefund");
	}
}
