import { HttpClient, HttpResponse } from "../contracts";
import { ensureTrailingSlash } from "./helpers";
import { RequestOptions } from "./request.models";

export abstract class Request implements HttpClient {
	protected _bodyFormat!: string;

	protected _options: RequestOptions = {};

	public constructor() {
		this.asJson();
	}

	public baseUrl(url: string): HttpClient {
		this._options.prefixUrl = ensureTrailingSlash(url);

		return this;
	}

	public asJson(): HttpClient {
		return this.bodyFormat("json").contentType("application/json");
	}

	public asForm(): HttpClient {
		return this.bodyFormat("form_params").contentType("application/x-www-form-urlencoded");
	}

	public asMultipart(): HttpClient {
		return this.bodyFormat("multipart");
	}

	public bodyFormat(format: string): HttpClient {
		this._bodyFormat = format;

		return this;
	}

	public contentType(contentType: string): HttpClient {
		return this.withHeaders({ "Content-Type": contentType });
	}

	public acceptJson(): HttpClient {
		return this.accept("application/json");
	}

	public accept(contentType: string): HttpClient {
		return this.withHeaders({ Accept: contentType });
	}

	public withHeaders(headers: object): HttpClient {
		this._options.headers = { ...this._options.headers, ...headers };

		return this;
	}

	public timeout(seconds: number): HttpClient {
		this._options.timeout = seconds;

		return this;
	}

	public retry(times: number, sleep?: number): HttpClient {
		this._options.retry = {
			limit: times,
			maxRetryAfter: sleep,
		};

		return this;
	}

	public withOptions(options: object): HttpClient {
		this._options = { ...this._options, ...options };

		return this;
	}

	public async get(url: string, query?: object): Promise<HttpResponse> {
		return this.send("GET", url, { query });
	}

	public async head(url: string, query?: object): Promise<HttpResponse> {
		return this.send("HEAD", url, { query });
	}

	public async post(url: string, data?: object): Promise<HttpResponse> {
		return this.send("POST", url, { data });
	}

	public async patch(url: string, data?: object): Promise<HttpResponse> {
		return this.send("PATCH", url, { data });
	}

	public async put(url: string, data?: object): Promise<HttpResponse> {
		return this.send("PUT", url, { data });
	}

	public async delete(url: string, data?: object): Promise<HttpResponse> {
		return this.send("DELETE", url, { data });
	}

	protected abstract async send(
		method: string,
		url: string,
		data?: { query?: object; data?: any },
	): Promise<HttpResponse>;
}
