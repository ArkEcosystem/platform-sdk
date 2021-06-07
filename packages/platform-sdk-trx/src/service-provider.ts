import { Coins, IoC } from "@arkecosystem/platform-sdk";

import * as Services from "./services";

export class ServiceProvider extends IoC.AbstractServiceProvider implements IoC.IServiceProvider {
	public async make(container: IoC.Container): Promise<void> {
		return this.compose(Services, container);
	}
}
