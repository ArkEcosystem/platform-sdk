/* istanbul ignore file */

import { inject, injectable } from "inversify";

import { ConfigRepository } from "../coins";
import { BigNumberService } from "../services";
import { Container } from "./container";
import { BindingType, ServiceList } from "./service-provider.contract";

@injectable()
export abstract class AbstractServiceProvider {
	@inject(BindingType.ConfigRepository)
	protected readonly configRepository!: ConfigRepository;

	protected async compose(services: ServiceList, container: Container): Promise<void> {
		container.singleton(BindingType.AddressService, services.AddressService);
		container.singleton(BindingType.BigNumberService, BigNumberService);
		container.singleton(BindingType.ClientService, services.ClientService);
		container.singleton(BindingType.DataTransferObjectService, services.DataTransferObjectService);
		container.singleton(BindingType.ExtendedAddressService, services.ExtendedAddressService);
		container.singleton(BindingType.FeeService, services.FeeService);
		container.singleton(BindingType.KeyPairService, services.KeyPairService);
		container.singleton(BindingType.KnownWalletService, services.KnownWalletService);
		container.singleton(BindingType.LedgerService, services.LedgerService);
		container.singleton(BindingType.LinkService, services.LinkService);
		container.singleton(BindingType.MessageService, services.MessageService);
		container.singleton(BindingType.MultiSignatureService, services.MultiSignatureService);
		container.singleton(BindingType.PrivateKeyService, services.PrivateKeyService);
		container.singleton(BindingType.PublicKeyService, services.PublicKeyService);
		container.singleton(BindingType.SignatoryService, services.SignatoryService);
		container.singleton(BindingType.TransactionService, services.TransactionService);
		container.singleton(BindingType.WalletDiscoveryService, services.WalletDiscoveryService);
		container.singleton(BindingType.WIFService, services.WIFService);
	}
}
