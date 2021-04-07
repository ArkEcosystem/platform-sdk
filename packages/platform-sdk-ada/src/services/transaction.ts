import { Coins, Contracts, Exceptions } from "@arkecosystem/platform-sdk";
import CardanoWasm, { Address } from "@emurgo/cardano-serialization-lib-nodejs";

import { SignedTransactionData } from "../dto";
import { postGraphql } from "./helpers";
import { deriveAccountKey, deriveRootKey, deriveSpendKey } from "./identity/shelley";
import { createValue } from "./transaction.helpers";

export interface UnspentTransaction {
	address: string;
	index: string;
	transaction: {
		hash: string;
	};
	value: string;
}

export class TransactionService implements Contracts.TransactionService {
	readonly #config: Coins.Config;

	public constructor(config: Coins.Config) {
		this.#config = config;
	}

	public static async __construct(config: Coins.Config): Promise<TransactionService> {
		return new TransactionService(config);
	}

	public async __destruct(): Promise<void> {
		//
	}

	public async transfer(
		input: Contracts.TransferInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		if (input.sign.mnemonic === undefined) {
			throw new Exceptions.MissingArgument(this.constructor.name, "transfer", "sign.mnemonic");
		}

		const { minFeeA, minFeeB, minUTxOValue, poolDeposit, keyDeposit } = this.#config.get<Contracts.KeyValuePair>(
			"network.meta",
		);

		// This is the transaction builder that uses values from the genesis block of the configured network.
		const txBuilder = CardanoWasm.TransactionBuilder.new(
			CardanoWasm.LinearFee.new(
				CardanoWasm.BigNum.from_str(minFeeA.toString()),
				CardanoWasm.BigNum.from_str(minFeeB.toString()),
			),
			CardanoWasm.BigNum.from_str(minUTxOValue.toString()),
			CardanoWasm.BigNum.from_str(poolDeposit.toString()),
			CardanoWasm.BigNum.from_str(keyDeposit.toString()),
		);

		// Get a `Bip32PrivateKey` instance according to `CIP1852` and turn it into a `PrivateKey` instance
		const rootKey = deriveRootKey(input.sign.mnemonic);
		const accountKey = deriveAccountKey(rootKey, 0);
		const privateKey = accountKey.to_raw_key();
		console.log(
			"privateKey",
			Buffer.from(privateKey.as_bytes()).toString("hex"),
			"publicKey",
			Buffer.from(privateKey.to_public().as_bytes()).toString("hex"),
		);

		// These are the inputs (UTXO) that will be consumed to satisfy the outputs. Any change will be transferred back to the sender
		const utxos: UnspentTransaction[] = await this.listUnspentTransactions(input.from);

		// for (let i = 0; i < utxos.length; i++) {
		const i = 0;
		const utxo: UnspentTransaction = utxos[i];

		txBuilder.add_input(
			Address.from_bech32(utxo.address),
			CardanoWasm.TransactionInput.new(
				CardanoWasm.TransactionHash.from_bytes(Buffer.from(utxo.transaction.hash, "hex")),
				parseInt(utxo.index),
			),
			createValue(utxo.value),
		);

		console.log("utxo", utxo);
		// break;
		// }

		// These are the outputs that will be transferred to other wallets. For now we only support a single output.
		txBuilder.add_output(
			CardanoWasm.TransactionOutput.new(
				CardanoWasm.Address.from_bech32(input.data.to),
				createValue(input.data.amount),
			),
		);

		// This is the expiration slot which should be estimated with #estimateExpiration
		if (input.data.expiration === undefined) {
			txBuilder.set_ttl(parseInt(await this.estimateExpiration()));
		} else {
			txBuilder.set_ttl(input.data.expiration);
		}

		// calculate the min fee required and send any change to an address
		txBuilder.add_change_if_needed(CardanoWasm.Address.from_bech32(input.from));

		// once the transaction is ready, we build it to get the tx body without witnesses
		const txBody = txBuilder.build();
		const txHash = CardanoWasm.hash_transaction(txBody);

		// TODO Change hard-coded 1 to proper index/indices based on building the mapping
		// We use index 1 here, because we know that's the right index for this utxo (is it?)
		const vkeyWitness = CardanoWasm.make_vkey_witness(txHash, deriveSpendKey(accountKey, 1).to_raw_key());

		const vkeyWitnesses = CardanoWasm.Vkeywitnesses.new();
		vkeyWitnesses.add(vkeyWitness);

		const witnesses = CardanoWasm.TransactionWitnessSet.new();
		witnesses.set_vkeys(vkeyWitnesses);

		console.log("hash", Buffer.from(txHash.to_bytes()).toString("hex"));
		const transaction = CardanoWasm.Transaction.new(txBody, witnesses);

		return new SignedTransactionData(
			Buffer.from(txHash.to_bytes()).toString("hex"),
			{
				sender: input.from,
				recipient: input.data.to,
				amount: input.data.amount,
				fee: txBody.fee().to_str(),
			},
			Buffer.from(transaction.to_bytes()).toString("hex"),
		);
	}

	public async secondSignature(
		input: Contracts.SecondSignatureInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "secondSignature");
	}

	public async delegateRegistration(
		input: Contracts.DelegateRegistrationInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "delegateRegistration");
	}

	public async vote(
		input: Contracts.VoteInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "vote");
	}

	public async multiSignature(
		input: Contracts.MultiSignatureInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "multiSignature");
	}

	public async ipfs(
		input: Contracts.IpfsInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "ipfs");
	}

	public async multiPayment(
		input: Contracts.MultiPaymentInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "multiPayment");
	}

	public async delegateResignation(
		input: Contracts.DelegateResignationInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "delegateResignation");
	}

	public async htlcLock(
		input: Contracts.HtlcLockInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "htlcLock");
	}

	public async htlcClaim(
		input: Contracts.HtlcClaimInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "htlcClaim");
	}

	public async htlcRefund(
		input: Contracts.HtlcRefundInput,
		options?: Contracts.TransactionOptions,
	): Promise<Contracts.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "htlcRefund");
	}

	public async multiSign(
		transaction: Contracts.RawTransactionData,
		input: Contracts.TransactionInputs,
	): Promise<Contracts.SignedTransactionData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "multiSign");
	}

	public async estimateExpiration(value?: string): Promise<string> {
		const tip: number = parseInt(
			(await postGraphql(this.#config, `{ cardano { tip { slotNo } } }`)).cardano.tip.slotNo,
		);
		const ttl: number = parseInt(value || "7200"); // Yoroi uses 7200 as TTL default

		return (tip + ttl).toString();
	}

	// private derivePrivateByAddressing(request: {
	// 	addressing: $PropertyType<Addressing, 'addressing'>,
	// 	startingFrom: {
	// 		key: RustModule.WalletV4.Bip32PrivateKey,
	// 		level: number,
	// 		},
	// 	}): RustModule.WalletV4.Bip32PrivateKey {
	// 	if (request.startingFrom.level + 1 < request.addressing.startLevel) {
	// 		throw new Error(`${nameof(derivePrivateByAddressing)} keyLevel < startLevel`);
	// 	}
	// 	let derivedKey = request.startingFrom.key;
	// 	for (
	// 		let i = request.startingFrom.level - request.addressing.startLevel + 1;
	// 		i < request.addressing.path.length;
	// 		i++
	// 	) {
	// 		derivedKey = derivedKey.derive(
	// 			request.addressing.path[i]
	// 		);
	// 	}
	// 	return derivedKey;
	// }

	private async listUnspentTransactions(address: string): Promise<UnspentTransaction[]> {
		return (
			await postGraphql(
				this.#config,
				`{
				utxos(
				  order_by: { value: desc }
				  where: {
					address: {
					  _eq: "${address}"
					}
				  }
				) {
				  address
				  index
				  transaction {
						hash
				  }
				  value
				}
			  }`,
			)
		).utxos;
	}
}
