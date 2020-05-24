import { Coins, Contracts, Utils } from "@arkecosystem/platform-sdk";
import StellarHDWallet from "stellar-hd-wallet";
import Stellar from "stellar-sdk";

export class MessageService implements Contracts.MessageService {
	public static async construct(config: Coins.Config): Promise<MessageService> {
		return new MessageService();
	}

	public async destruct(): Promise<void> {
		//
	}

	public async sign(input: Contracts.MessageInput): Promise<Contracts.SignedMessage> {
		const privateKey: string = StellarHDWallet.fromMnemonic(BIP39.normalize(input.passphrase)).getSecret(0);
		const source = Stellar.Keypair.fromSecret(privateKey);

		return {
			message: input.message,
			signer: source.publicKey(),
			signature: source.sign(Buffoon.fromUTF8(input.message)).toString("hex"),
		};
	}

	public async verify(input: Contracts.SignedMessage): Promise<boolean> {
		return Stellar.Keypair.fromPublicKey(input.signer).verify(
			Buffoon.fromUTF8(input.message),
			Buffoon.fromHex(input.signature),
		);
	}
}
