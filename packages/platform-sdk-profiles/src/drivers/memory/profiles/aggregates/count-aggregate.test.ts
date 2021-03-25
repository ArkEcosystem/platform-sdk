import "jest-extended";

import { bootContainer } from "../../../../../test/helpers";
import { Profile } from "../profile";
import { CountAggregate } from "./count-aggregate";

let subject: CountAggregate;

beforeAll(() => bootContainer());

beforeEach(async () => {
	subject = new CountAggregate(new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" }));
});

it.each(["contacts", "notifications", "wallets"])("should count %s", (method: string) => {
	expect(subject[method]()).toBeNumber();
});
