export class Exception extends Error {
	public constructor(message: string) {
		super(message);

		Object.defineProperty(this, "message", {
			enumerable: false,
			value: message,
		});

		Object.defineProperty(this, "name", {
			enumerable: false,
			value: this.constructor.name,
		});

		Error.captureStackTrace(this, this.constructor);
	}
}

export class NotImplemented extends Exception {
	public constructor(klass: string, method: string) {
		super(`Method ${klass}#${method} is not implemented.`);
	}
}

export class NotSupported extends Exception {
	public constructor(klass: string, method: string) {
		super(`Method ${klass}#${method} is not supported.`);
	}
}

export class InvalidArguments extends Exception {
	public constructor(klass: string, method: string) {
		super(`Method ${klass}#${method} does not accept the given arguments.`);
	}
}

export class MissingArgument extends Exception {
	public constructor(klass: string, method: string, arg: string) {
		super(`Method ${klass}#${method} expects the argument [${arg}] but it was not given.`);
	}
}

export class CryptoException extends Exception {
	public constructor(error: Error) {
		super(error.message);
	}
}
