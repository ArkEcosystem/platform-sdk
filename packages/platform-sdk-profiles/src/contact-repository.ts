import { Contact } from "./contact";
import { ContactAddress } from "./contracts";

export class ContactRepository {
	#contacts: Contact[] = [];

	public constructor(contacts: Contact[]) {
		this.#contacts = contacts;
	}

	public all(): Contact[] {
		return this.#contacts;
	}

	public starred(): Contact[] {
		return this.#contacts.filter((contact: Contact) => contact.isStarred());
	}

	public push(contact: Contact): void {
		this.#contacts.push(contact);
	}

	public findByAddress(value: string): Contact[] {
		return this.findByColumn("address", value);
	}

	public findByCoin(value: string): Contact[] {
		return this.findByColumn("coin", value);
	}

	public findByNetwork(value: string): Contact[] {
		return this.findByColumn("network", value);
	}

	public flush(): void {
		this.#contacts = [];
	}

	private findByColumn(column: string, value: string): Contact[] {
		return this.#contacts.filter((contact: Contact) =>
			contact.addresses().find((address: ContactAddress) => address[column] === value),
		);
	}
}
