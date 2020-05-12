import { Contracts } from "@arkecosystem/platform-sdk";
import StellarHDWallet from "stellar-hd-wallet";
import Stellar from "stellar-sdk";

export class MessageService implements Contracts.MessageService {
	public static async construct(opts: Contracts.KeyValuePair): Promise<MessageService> {
		return new MessageService();
	}

	public async destruct(): Promise<void> {
		//
	}

	public async sign(input: Contracts.MessageInput): Promise<Contracts.SignedMessage> {
		const privateKey: string = StellarHDWallet.fromMnemonic(input.passphrase).getSecret(0);
		const source = Stellar.Keypair.fromSecret(privateKey);

		return {
			message: input.message,
			signer: source.publicKey(),
			signature: source.sign(Buffer.from(input.message, "utf8")).toString("hex"),
		};
	}

	public async verify(input: Contracts.SignedMessage): Promise<boolean> {
		return Stellar.Keypair.fromPublicKey(input.signer).verify(
			Buffer.from(input.message, "utf8"),
			Buffer.from(input.signature, "hex"),
		);
	}
}
