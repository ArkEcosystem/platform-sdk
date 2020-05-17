import { Coins, Contracts, Exceptions } from "@arkecosystem/platform-sdk";

export class MessageService implements Contracts.MessageService {
	public static async construct(config: Coins.Config): Promise<MessageService> {
		return new MessageService();
	}

	public async destruct(): Promise<void> {
		//
	}

	public async sign(input: Contracts.MessageInput): Promise<Contracts.SignedMessage> {
		throw new Exceptions.NotImplemented(this.constructor.name, "sign");
	}

	public async verify(input: Contracts.SignedMessage): Promise<boolean> {
		throw new Exceptions.NotImplemented(this.constructor.name, "verify");
	}
}
