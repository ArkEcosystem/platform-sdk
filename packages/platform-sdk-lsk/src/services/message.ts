import { Coins, Contracts, Exceptions } from "@arkecosystem/platform-sdk";
import { signMessageWithPassphrase, verifyMessageWithPublicKey } from "@liskhq/lisk-cryptography";

export class MessageService implements Contracts.MessageService {
	public static async __construct(config: Coins.Config): Promise<MessageService> {
		return new MessageService();
	}

	public async __destruct(): Promise<void> {
		//
	}

	public async sign(input: Contracts.MessageInput): Promise<Contracts.SignedMessage> {
		if (input.mnemonic === undefined) {
			throw new Exceptions.MissingArgument(this.constructor.name, "sign", "mnemonic");
		}

		try {
			const { message, publicKey, signature } = signMessageWithPassphrase(input.message, input.mnemonic);

			return { message, signatory: publicKey, signature };
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}

	public async verify(input: Contracts.SignedMessage): Promise<boolean> {
		try {
			return verifyMessageWithPublicKey({
				message: input.message,
				publicKey: input.signatory,
				signature: input.signature,
			});
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}
}
