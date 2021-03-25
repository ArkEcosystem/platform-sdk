import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { SHA1 } from "bcrypto";
import NodeCache from "node-cache";

type CacheStore = Record<string, { expires_at: DateTime; value: unknown }>;

export interface ICache {
    all(): CacheStore;
    keys(): string[];
    get(key: string): T;
    set(key: string, value: unknown, ttl: number): void;
    has(key: string): boolean;
    forget(key: string): void;
    flush(): void;
}
