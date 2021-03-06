import StringCrypto from "string-crypto";

/**
 * Implements all functionality that is required to work with the PBKDF2
 * key derivation and password hashing algorithm as defined by the specs.
 *
 * @see {@link https://en.wikipedia.org/wiki/PBKDF2}
 *
 * @export
 * @class PBKDF2
 */
export class PBKDF2 {
	/**
	 * Encrypts the value with the given password.
	 *
	 * @static
	 * @param {string} value
	 * @param {string} password
	 * @returns {string}
	 * @memberof PBKDF2
	 */
	public static encrypt(value: string, password: string): string {
		return new StringCrypto().encryptString(value, password);
	}

	/**
	 * Decrypts the value with the given password.
	 *
	 * @remarks
	 * This function will throw an exception if the password doesn't match
	 * the hash because it won't be able to make sense of the data.
	 *
	 * @static
	 * @param {string} hash
	 * @param {string} password
	 * @returns {string}
	 * @memberof PBKDF2
	 */
	public static decrypt(hash: string, password: string): string {
		return new StringCrypto().decryptString(hash, password);
	}

	/**
	 * Verifies that the given hash and password match.
	 *
	 * @remarks
	 * A match in the has and password should be interpreted as ownership
	 * of whatever resource is protected by the given hash and password.
	 *
	 * @static
	 * @param {string} hash
	 * @param {string} password
	 * @returns {boolean}
	 * @memberof PBKDF2
	 */
	public static verify(hash: string, password: string): boolean {
		try {
			this.decrypt(hash, password);

			return true;
		} catch {
			return false;
		}
	}
}
