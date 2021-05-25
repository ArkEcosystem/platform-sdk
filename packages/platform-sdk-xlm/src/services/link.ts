import { Coins, Services } from "@arkecosystem/platform-sdk";

export class LinkService extends Services.AbstractLinkService {
	public static async __construct(config: Coins.Config): Promise<LinkService> {
		return new LinkService(config, {
			block: "ledger/{0}",
			transaction: "tx/{0}",
			wallet: "account/{0}",
		});
	}
}
