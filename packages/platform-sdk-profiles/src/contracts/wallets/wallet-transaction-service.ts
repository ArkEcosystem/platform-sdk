import { Contracts } from "@arkecosystem/platform-sdk";

type SignedTransactionDataDictionary = Record<string, Contracts.SignedTransactionData>;

/**
 * Defines the implementation contract for the transaction service.
 *
 * @export
 * @interface ITransactionService
 */
export interface ITransactionService {
	/**
	 * Sync both pending and ready multi signature transactions.
	 *
	 * @return {Promise<void>}
	 * @memberof ITransactionService
	 */
	sync(): Promise<void>;

	/**
	 * Sign the transaction for the given ID with the given mnemonic.
	 *
	 * @param {string} id
	 * @param {string} mnemonic
	 * @return {Promise<void>}
	 * @memberof ITransactionService
	 */
	addSignature(id: string, mnemonic: string): Promise<void>;

	/**
	 * Sign a Transfer transaction.
	 *
	 * @param {Contracts.TransferInput} input
	 * @param {Contracts.TransactionOptions} options
	 * @return {Promise<string>}
	 * @memberof ITransactionService
	 */
	signTransfer(input: Contracts.TransferInput, options: Contracts.TransactionOptions): Promise<string>;

	/**
	 * Sign a Second-Signature Registration transaction.
	 *
	 * @param {Contracts.SecondSignatureInput} input
	 * @param {Contracts.TransactionOptions} options
	 * @return {Promise<string>}
	 * @memberof ITransactionService
	 */
	signSecondSignature(input: Contracts.SecondSignatureInput, options: Contracts.TransactionOptions): Promise<string>;

	/**
	 * Sign a Delegate Registration transaction.
	 *
	 * @param {Contracts.DelegateRegistrationInput} input
	 * @param {Contracts.TransactionOptions} options
	 * @return {Promise<string>}
	 * @memberof ITransactionService
	 */
	signDelegateRegistration(
		input: Contracts.DelegateRegistrationInput,
		options: Contracts.TransactionOptions,
	): Promise<string>;

	/**
	 * Sign a Vote transaction.
	 *
	 * @param {Contracts.VoteInput} input
	 * @param {Contracts.TransactionOptions} options
	 * @return {Promise<string>}
	 * @memberof ITransactionService
	 */
	signVote(input: Contracts.VoteInput, options: Contracts.TransactionOptions): Promise<string>;

	/**
	 * Sign a Multi-Signature Registration transaction.
	 *
	 * @param {Contracts.MultiSignatureInput} input
	 * @param {Contracts.TransactionOptions} options
	 * @return {Promise<string>}
	 * @memberof ITransactionService
	 */
	signMultiSignature(input: Contracts.MultiSignatureInput, options: Contracts.TransactionOptions): Promise<string>;

	/**
	 * Sign an IPFS transaction.
	 *
	 * @param {Contracts.IpfsInput} input
	 * @param {Contracts.TransactionOptions} options
	 * @return {Promise<string>}
	 * @memberof ITransactionService
	 */
	signIpfs(input: Contracts.IpfsInput, options: Contracts.TransactionOptions): Promise<string>;

	/**
	 * Sign a Multi-Payment transaction.
	 *
	 * @param {Contracts.MultiPaymentInput} input
	 * @param {Contracts.TransactionOptions} options
	 * @return {Promise<string>}
	 * @memberof ITransactionService
	 */
	signMultiPayment(input: Contracts.MultiPaymentInput, options: Contracts.TransactionOptions): Promise<string>;

	/**
	 * Sign a Delegate Resignation transaction.
	 *
	 * @param {Contracts.DelegateResignationInput} input
	 * @param {Contracts.TransactionOptions} options
	 * @return {Promise<string>}
	 * @memberof ITransactionService
	 */
	signDelegateResignation(
		input: Contracts.DelegateResignationInput,
		options: Contracts.TransactionOptions,
	): Promise<string>;

	/**
	 * Sign a HTLC Lock transaction.
	 *
	 * @param {Contracts.HtlcLockInput} input
	 * @param {Contracts.TransactionOptions} options
	 * @return {Promise<string>}
	 * @memberof ITransactionService
	 */
	signHtlcLock(input: Contracts.HtlcLockInput, options: Contracts.TransactionOptions): Promise<string>;

	/**
	 * Sign a HTLC Claim transaction.
	 *
	 * @param {Contracts.HtlcClaimInput} input
	 * @param {Contracts.TransactionOptions} options
	 * @return {Promise<string>}
	 * @memberof ITransactionService
	 */
	signHtlcClaim(input: Contracts.HtlcClaimInput, options: Contracts.TransactionOptions): Promise<string>;

	/**
	 * Sign a HTLC Refund transaction.
	 *
	 * @param {Contracts.HtlcRefundInput} input
	 * @param {Contracts.TransactionOptions} options
	 * @return {Promise<string>}
	 * @memberof ITransactionService
	 */
	signHtlcRefund(input: Contracts.HtlcRefundInput, options: Contracts.TransactionOptions): Promise<string>;

	/**
	 * Get the transaction for the given ID if it is exists with any valid state.
	 *
	 * @param {string} id
	 * @return {Contracts.SignedTransactionData}
	 * @memberof ITransactionService
	 */
	transaction(id: string): Contracts.SignedTransactionData;

	/**
	 * Get all transactions that are pending in some state.
	 *
	 * @return {SignedTransactionDataDictionary}
	 * @memberof ITransactionService
	 */
	pending(): SignedTransactionDataDictionary;

	/**
	 * Get all transactions that have been signed.
	 *
	 * @return {SignedTransactionDataDictionary}
	 * @memberof ITransactionService
	 */
	signed(): SignedTransactionDataDictionary;

	/**
	 * Get all transactions that have been broadcasted.
	 *
	 * @return {SignedTransactionDataDictionary}
	 * @memberof ITransactionService
	 */
	broadcasted(): SignedTransactionDataDictionary;

	/**
	 * Get all transactions that are waiting for your signature.
	 *
	 * @return {SignedTransactionDataDictionary}
	 * @memberof ITransactionService
	 */
	waitingForOurSignature(): SignedTransactionDataDictionary;

	/**
	 * Get all transactions that are waiting for the signatures of other participants.
	 *
	 * @return {SignedTransactionDataDictionary}
	 * @memberof ITransactionService
	 */
	waitingForOtherSignatures(): SignedTransactionDataDictionary;

	/**
	 * Check if the given ID has been signed.
	 *
	 * @param {string} id
	 * @return {boolean}
	 * @memberof ITransactionService
	 */
	hasBeenSigned(id: string): boolean;

	/**
	 * Check if the given ID has been broadcasted.
	 *
	 * @param {string} id
	 * @return {boolean}
	 * @memberof ITransactionService
	 */
	hasBeenBroadcasted(id: string): boolean;

	/**
	 * Check if the given ID has been confirmed.
	 *
	 * @param {string} id
	 * @return {boolean}
	 * @memberof ITransactionService
	 */
	hasBeenConfirmed(id: string): boolean;

	/**
	 * Check if the given ID is waiting to be confirmed.
	 *
	 * @param {string} id
	 * @return {boolean}
	 * @memberof ITransactionService
	 */
	isAwaitingConfirmation(id: string): boolean;

	/**
	 * Check if the given ID is waiting for your signature.
	 *
	 * @param {string} id
	 * @return {boolean}
	 * @memberof ITransactionService
	 */
	isAwaitingOurSignature(id: string): boolean;

	/**
	 * Check if the given ID is waiting for signatures of other participants.
	 *
	 * @param {string} id
	 * @return {boolean}
	 * @memberof ITransactionService
	 */
	isAwaitingOtherSignatures(id: string): boolean;

	/**
	 * Check if the given ID is waiting for a signature from the given public key.
	 *
	 * @param {string} id
	 * @param {string} publicKey
	 * @return {boolean}
	 * @memberof ITransactionService
	 */
	isAwaitingSignatureByPublicKey(id: string, publicKey: string): boolean;

	/**
	 * Check if the given transaction for the given ID can be signed.
	 *
	 * @param {string} id
	 * @return {boolean}
	 * @memberof ITransactionService
	 */
	canBeSigned(id: string): boolean;

	/**
	 * Check if the given transaction for the given ID can be broadcasted.
	 *
	 * @param {string} id
	 * @return {boolean}
	 * @memberof ITransactionService
	 */
	canBeBroadcasted(id: string): boolean;

	/**
	 * Broadcast the given ID.
	 *
	 * @param {string} id
	 * @return {Promise<Contracts.BroadcastResponse>}
	 * @memberof ITransactionService
	 */
	broadcast(id: string): Promise<Contracts.BroadcastResponse>;

	/**
	 * Check if the given ID has been confirmed by the respective network.
	 *
	 * @param {string} id
	 * @return {Promise<boolean>}
	 * @memberof ITransactionService
	 */
	confirm(id: string): Promise<boolean>;

	/**
	 * Dump the transactions as JSON strings.
	 *
	 * @memberof ITransactionService
	 */
	dump(): void;

	/**
	 * Restore the transactions as DTO instances.
	 *
	 * @memberof ITransactionService
	 */
	restore(): void;
}
