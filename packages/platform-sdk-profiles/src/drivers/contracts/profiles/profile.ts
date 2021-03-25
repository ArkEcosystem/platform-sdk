/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { IPluginRepository } from "../plugins/plugin-repository";
import { IContactRepository } from "../repositories/contact-repository";
import { IDataRepository } from "../repositories/data-repository";
import { INotificationRepository } from "../repositories/notification-repository";
import { IPeerRepository } from "../repositories/peer-repository";
import { ISettingRepository } from "../repositories/setting-repository";
import { IWalletRepository } from "../repositories/wallet-repository";
import { ICountAggregate } from "./aggregates/count-aggregate";
import { IRegistrationAggregate } from "./aggregates/registration-aggregate";
import { ITransactionAggregate } from "./aggregates/transaction-aggregate";
import { IWalletAggregate } from "./aggregates/wallet-aggregate";
import { IAuthenticator } from "./authenticator";

export interface IProfileStruct {
	id: string;
	wallets: Record<string, any>;
	contacts: Record<string, any>;
	peers: Record<string, any>;
	plugins: Record<string, any>;
	notifications: Record<string, any>;
	data: Record<string, any>;
	settings: Record<string, any>;
}

export interface IProfileInput {
	id: string;
	name: string;
	avatar?: string;
	password?: string;
	data: string;
}

export interface WalletExportOptions {
	excludeEmptyWallets: boolean;
	excludeLedgerWallets: boolean;
	addNetworkInformation: boolean;
}

export interface ProfileExportOptions extends WalletExportOptions {
	saveGeneralSettings: boolean;
}

export interface IProfile {
    id(): string;
    name(): string;
    avatar(): string;
    balance(): BigNumber;
    convertedBalance(): BigNumber;
    contacts(): IContactRepository;
    data(): IDataRepository;
    notifications(): INotificationRepository;
    peers(): IPeerRepository;
    plugins(): IPluginRepository;
    settings(): ISettingRepository;
    wallets(): IWalletRepository;
    flush(): void;
    countAggregate(): ICountAggregate;
    registrationAggregate(): IRegistrationAggregate;
    transactionAggregate(): ITransactionAggregate;
    walletAggregate(): IWalletAggregate;
    auth(): IAuthenticator;
    usesPassword(): boolean;
    usesMultiPeerBroadcasting(): boolean;
    toObject(options: ProfileExportOptions): IProfileStruct;
    dump(): IProfileInput;
    restore(password: string): Promise<void>;
    initializeSettings(): void;
    migrate(migrations: object, versionToMigrate: string): Promise<void>;
    getRawData(): IProfileInput;
    setRawData(data: IProfileInput): void;
    setRawDataKey(key: keyof IProfileInput, value: string): void;
    save(password: string): void;
    export(password: string, options: ProfileExportOptions): string;
}
