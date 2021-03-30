import { Contracts, Http } from "@arkecosystem/platform-sdk";
import bent from "bent";
import { URLSearchParams } from "url";

/**
 * Implements HTTP communication through mikeal/bent.
 *
 * @see https://github.com/mikeal/bent
 *
 * @export
 * @class Request
 * @extends {Http.Request}
 */
export class Request extends Http.Request {
	/** {@inheritDoc Http.Request.send} */
	protected async send(
		method: string,
		url: string,
		data?: { query?: object; data?: any },
	): Promise<Contracts.HttpResponse> {
		const options: Http.RequestOptions = {
			...this._options,
		};

		url = url.replace(/^\/+/g, "");

		if (data && data.query) {
			options.searchParams = data.query;
		}

		if (options.searchParams) {
			url = `${url}?${new URLSearchParams(options.searchParams)}`;
		}

		if (data && data.data) {
			if (this._bodyFormat === "json") {
				options.json = data.data;
			}

			if (this._bodyFormat === "form_params") {
				options.body = new URLSearchParams();

				for (const [key, value] of Object.entries(data.data)) {
					options.body.set(key, value);
				}
			}
		}

		try {
			let response;

			if (method === "GET") {
				response = await bent(method)(url);
			} else {
				response = await bent(method)(url, options.json || options.body, options.headers);
			}

			return new Http.Response({
				body: await response.text(),
				headers: response.headers,
				statusCode: response.statusCode,
			});
		} catch (error) {
			return new Http.Response(
				{
					body: await error.text(),
					headers: error.headers,
					statusCode: error.statusCode,
				},
				error,
			);
		}
	}
}
