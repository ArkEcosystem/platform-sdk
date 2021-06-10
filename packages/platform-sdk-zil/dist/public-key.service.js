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
exports.PublicKeyService = void 0;
const platform_sdk_1 = require("@arkecosystem/platform-sdk");
const account_1 = require("@zilliqa-js/account");
const constants_1 = require("./constants");
const zilliqa_1 = require("./zilliqa");
let PublicKeyService = class PublicKeyService extends platform_sdk_1.Services.AbstractPublicKeyService {
	constructor() {
		super(...arguments);
		Object.defineProperty(this, "wallet", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		});
	}
	async fromMnemonic(mnemonic, options) {
		return {
			publicKey: (await zilliqa_1.accountFromMnemonic(this.wallet, mnemonic, options)).publicKey,
		};
	}
};
__decorate(
	[platform_sdk_1.IoC.inject(constants_1.BindingType.Wallet), __metadata("design:type", account_1.Wallet)],
	PublicKeyService.prototype,
	"wallet",
	void 0,
);
PublicKeyService = __decorate([platform_sdk_1.IoC.injectable()], PublicKeyService);
exports.PublicKeyService = PublicKeyService;
//# sourceMappingURL=public-key.service.js.map