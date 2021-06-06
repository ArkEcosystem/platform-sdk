import { IoC, Services } from "@arkecosystem/platform-sdk";

@IoC.injectable()
export class LinkService extends Services.AbstractLinkService {
	protected schema(): Services.LinkServiceSchema {
		return {
			block: "block/{0}",
			transaction: "tx/{0}",
			wallet: "address/{0}",
		};
	}
}
