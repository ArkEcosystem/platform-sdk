import "jest-extended";

import nock from "nock";
import { Request } from "@arkecosystem/platform-sdk-http-got";

import { Business } from "./business";

let subject: Business;

beforeAll(() => nock.disableNetConnect());

beforeEach(async () => (subject = new Business((new Request).baseUrl('https://marketsquare.io/api'))));

afterEach(() => nock.cleanAll());

describe("Business", function () {
	it("should list all businesses", async () => {
		nock('https://marketsquare.io/')
			.get("/api/businesses")
			.reply(200, require(`${__dirname}/../../test/fixtures/entity-list.json`));

		await expect(subject.all()).resolves.toContainAllKeys(["data", "links", "meta"]);
	});

	it("should show the business for the given ID", async () => {
		nock('https://marketsquare.io/')
			.get("/api/businesses/1")
			.reply(200, require(`${__dirname}/../../test/fixtures/entity-show.json`));

		await expect(subject.show(1)).resolves.toContainAllKeys(["id", "name", "display_name", "slug", "description", "excerpt", "avatar", "is_claimed", "is_featured", "is_grant", "is_hidden", "is_indexable", "is_official", "is_promoted", "is_resigned", "is_verified", "registered_at", "created_at", "updated_at", "identity", "aip36", "ipfs", "npm", "manifest"]);
	});
});
