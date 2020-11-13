import "jest-extended";

import { Profile } from "../profiles/profile";
import { PeerRepository } from "./peer-repository";

let subject: PeerRepository;

beforeEach(() => (subject = new PeerRepository()));

describe("PeerRepository", () => {
	it("should push, get, list and forget any given peers", async () => {
		subject.set("ARK", "mainnet", "https://ip:port/api");

		expect(subject.has("ARK", "mainnet")).toBeTrue();

		subject.set("ARK", "devnet", "https://ip:port/api");

		expect(subject.has("ARK", "devnet")).toBeTrue();

		subject.forget("ARK", "devnet");

		expect(() => subject.get("ARK", "devnet")).toThrow("No peer found for");
	});
});
