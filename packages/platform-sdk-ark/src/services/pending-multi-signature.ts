import { Crypto, Transactions } from "@arkecosystem/crypto";
import { Contracts } from "@arkecosystem/platform-sdk";

export class PendingMultiSignature {
	readonly #transaction: Contracts.RawTransactionData;

	public constructor(transaction: Contracts.RawTransactionData) {
		this.#transaction = transaction;
	}

	public isMultiSignature(): boolean {
		return !!this.#transaction.multiSignature;
	}

	public isMultiSignatureRegistration(): boolean {
		return this.#transaction.type === 4;
	}

	public isMultiSignatureReady(excludeFinal?: boolean): boolean {
		if (this.needsSignatures()) {
			return false;
		} else if (!excludeFinal && this.isMultiSignatureRegistration() && this.needsFinalSignature()) {
			return false;
		}

		return true;
	}

	public needsSignatures(): boolean {
		if (!this.isMultiSignature()) {
			return false;
		}

		if (this.isMultiSignatureRegistration()) {
			return this.needsAllSignatures();
		}

		return this.getValidMultiSignatures().length < this.#transaction.multiSignature.min;
	}

	public needsAllSignatures(): boolean {
		return this.getValidMultiSignatures().length < this.#transaction.multiSignature.publicKeys.length;
	}

	public needsWalletSignature(publicKey: string): boolean {
		const transaction: Contracts.RawTransactionData = this.#transaction;

		if (!this.needsSignatures() && !this.needsFinalSignature()) {
			return false;
		}

		if (this.isMultiSignatureRegistration() && this.isMultiSignatureReady(true)) {
			return transaction.senderPublicKey === publicKey && this.needsFinalSignature();
		}

		if (!this.isMultiSignature()) {
			return false;
		}

		const index: number = transaction.multiSignature.publicKeys.indexOf(publicKey);
		if (index === -1) {
			return false;
		}

		if (!transaction.signatures) {
			return true;
		}

		const signature: string | undefined = transaction.signatures.find(
			(signature) => parseInt(signature.substring(0, 2), 16) === index,
		);
		if (!signature) {
			return true;
		}

		return !Crypto.Hash.verifySchnorr(this.getHash(), signature.slice(2, 130), publicKey);
	}

	public needsFinalSignature(): boolean {
		const transaction: Contracts.RawTransactionData = this.#transaction;

		if (this.isMultiSignature() && !this.isMultiSignatureRegistration()) {
			return false;
		}

		return (
			!transaction.signature ||
			!Crypto.Hash.verifySchnorr(this.getHash(false), transaction.signature, transaction.senderPublicKey)
		);
	}

	public getValidMultiSignatures(): string[] {
		const transaction: Contracts.RawTransactionData = this.#transaction;

		if (!this.isMultiSignature()) {
			return [];
		}

		if (!transaction.signatures || !transaction.signatures.length) {
			return [];
		}

		const validSignatures: string[] = [];
		for (const signature of transaction.signatures) {
			const publicKeyIndex: number = parseInt(signature.slice(0, 2), 16);
			const partialSignature: string = signature.slice(2, 130);
			const publicKey: string = transaction.multiSignature.publicKeys[publicKeyIndex];

			if (Crypto.Hash.verifySchnorr(this.getHash(transaction), partialSignature, publicKey)) {
				validSignatures.push(signature);
			}
		}

		return validSignatures;
	}

	public remainingSignatureCount(): number {
		const transaction: Contracts.RawTransactionData = this.#transaction;

		let min: number = transaction.multiSignature.min;

		if (this.isMultiSignatureRegistration()) {
			min = transaction.multiSignature.publicKeys.length;
		}

		return min - transaction.signatures.length;
	}

	private getHash(excludeMultiSignature = true): Buffer {
		return Transactions.Utils.toHash(this.#transaction, {
			excludeSignature: true,
			excludeSecondSignature: true,
			excludeMultiSignature,
		});
	}
}
