export interface MessageService {
	destruct(): Promise<void>;

	sign(input: MessageInput): Promise<SignedMessage>;

	verify(input: SignedMessage): Promise<boolean>;
}

export interface SignedMessage {
	message: string;
	signatory: string;
	signature: string;
}

export interface MessageInput {
	message: string;
	mnemonic: string;
}
