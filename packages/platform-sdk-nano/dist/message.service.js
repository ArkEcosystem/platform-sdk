"use strict";
var __decorate =
	(this && this.__decorate) ||
	function (decorators, target, key, desc) {
		var c = arguments.length,
			r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
			d;
		if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
			r = Reflect.decorate(decorators, target, key, desc);
		else
			for (var i = decorators.length - 1; i >= 0; i--)
				if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
var __metadata =
	(this && this.__metadata) ||
	function (k, v) {
		if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const platform_sdk_1 = require("@arkecosystem/platform-sdk");
const noble_ed25519_1 = require("noble-ed25519");
let MessageService = class MessageService extends platform_sdk_1.Services.AbstractMessageService {
	constructor() {
		super(...arguments);
		Object.defineProperty(this, "keyPairService", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		});
	}
	async sign(input) {
		try {
			const { privateKey } = await this.keyPairService.fromMnemonic(input.signatory.signingKey());
			if (privateKey === undefined) {
				throw new Error("Failed to retrieve the private key for the signatory wallet.");
			}
			return {
				message: input.message,
				signatory: await noble_ed25519_1.getPublicKey(privateKey),
				signature: await noble_ed25519_1.sign(Buffer.from(input.message, "utf8").toString("hex"), privateKey),
			};
		} catch (error) {
			throw new platform_sdk_1.Exceptions.CryptoException(error);
		}
	}
	async verify(input) {
		try {
			return noble_ed25519_1.verify(
				input.signature,
				Buffer.from(input.message, "utf8").toString("hex"),
				input.signatory,
			);
		} catch (error) {
			throw new platform_sdk_1.Exceptions.CryptoException(error);
		}
	}
};
__decorate(
	[platform_sdk_1.IoC.inject(platform_sdk_1.IoC.BindingType.KeyPairService), __metadata("design:type", Object)],
	MessageService.prototype,
	"keyPairService",
	void 0,
);
MessageService = __decorate([platform_sdk_1.IoC.injectable()], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=message.service.js.map