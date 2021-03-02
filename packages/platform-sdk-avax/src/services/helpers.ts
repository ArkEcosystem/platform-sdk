import { Coins } from "@arkecosystem/platform-sdk";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { Arr } from "@arkecosystem/platform-sdk-support";
import { Avalanche, BinTools, Buffer, utils } from "avalanche";
import { AVMAPI, KeyChain, KeyPair } from "avalanche/dist/apis/avm";
import { InfoAPI } from "avalanche/dist/apis/info";
import { PlatformVMAPI } from "avalanche/dist/apis/platformvm";
import HDKey from "hdkey";
import urlParseLax from "url-parse-lax";

export const useAvalanche = (config: Coins.Config): Avalanche => {
	const { hostname: host, port, protocol } = urlParseLax(
		Arr.randomElement(config.get<string[]>("network.networking.hosts")),
	);

	return new Avalanche(
		host,
		port,
		protocol.replace(":", ""),
		parseInt(config.get("network.crypto.networkId")),
		config.get("network.crypto.blockchainId"),
	);
};

export const useInfo = (config: Coins.Config): InfoAPI => useAvalanche(config).Info();

export const useXChain = (config: Coins.Config): AVMAPI => useAvalanche(config).XChain();

export const usePChain = (config: Coins.Config): PlatformVMAPI => useAvalanche(config).PChain();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useKeychain = (config: Coins.Config) => useXChain(config).keyChain();

export const cb58Decode = (value: string): Buffer => BinTools.getInstance().cb58Decode(value);

export const cb58Encode = (value: Buffer): string => BinTools.getInstance().cb58Encode(value);

// Crypto
export const keyPairFromMnemonic = (config: Coins.Config, mnemonic: string): KeyPair =>
	new KeyChain(utils.getPreferredHRP(parseInt(config.get("network.crypto.networkId"))), "X").importKey(
		// @ts-ignore
		HDKey.fromMasterSeed(BIP39.toSeed(mnemonic)).derive(`m/44'/9000'/0'/0/0`).privateKey,
	);
