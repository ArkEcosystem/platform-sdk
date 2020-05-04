# Documentation

- [Documentation](#documentation)
	- [Architecture](#architecture)
		- [Contracts](#contracts)
		- [Not Supported](#not-supported)
		- [Not Implemented](#not-implemented)
		- [Async Operations](#async-operations)
	- [Functionality](#functionality)
	- [API Methods](#api-methods)

## Architecture

### Contracts

Each coin follows a strict implementation contract. All of these contracts can be found at [platform-sdk/src/contracts](https://github.com/ArkEcosystem/platform-sdk/tree/master/packages/platform-sdk/src/contracts).

### Not Supported

Methods that are not supported will throw a `NotSupported` exception. A case of this would be if a coin doesn't have a the concept of voting which means we won't be able to support that feature.

### Not Implemented

Methods that will be supported in the future but are not implemented yet will throw a `NotImplemented` exception. A case of this would be a coin that supports voting but we have no plans yet of supporting this functionality in our applications.

### Async Operations

The majority of methods are `async` with a few exceptions. This is due to the fact that some coins require a network connection or perform computations in an async manner.

To avoid an inconsistent public API where some things are instantiated and called with `await` and others aren't you'll have to call most things with `await` and use the static `construct` method to create an instance of a service. This will allow you to swap out adapters without having to think about how they are instantiated.

## Functionality

| Class              | Functions                 | ADA | ARK                | ATOM | BTC | EOS | ETH | LSK | NEO | TRX | XMR | XRP |
| ------------------ | ------------------------- | --- | ------------------ | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
| ClientService      | transaction               | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| ClientService      | transactions              | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| ClientService      | wallet                    | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| ClientService      | wallets                   | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| ClientService      | delegate                  | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| ClientService      | delegates                 | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| ClientService      | peers                     | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| ClientService      | configuration             | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| ClientService      | fees                      | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| ClientService      | syncing                   | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| ClientService      | broadcast                 | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| TransactionService | transfer                  | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| TransactionService | secondSignature           | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| TransactionService | delegateRegistration      | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| TransactionService | vote                      | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| TransactionService | multiSignature            | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| TransactionService | ipfs                      | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| TransactionService | multiPayment              | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| TransactionService | delegateResignation       | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| TransactionService | htlcLock                  | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| TransactionService | htlcClaim                 | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| TransactionService | htlcRefund                | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| IdentityService    | address(passphrase)       | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| IdentityService    | address(multiSignature)   | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| IdentityService    | address(publicKey)        | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| IdentityService    | address(privateKey)       | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| IdentityService    | address(wif)              | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| IdentityService    | publicKey(passphrase)     | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| IdentityService    | publicKey(multiSignature) | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| IdentityService    | publicKey(wif)            | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| IdentityService    | privateKey(passphrase)    | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| IdentityService    | privateKey(wif)           | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| IdentityService    | wif(passphrase)           | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| IdentityService    | keyPair(passphrase)       | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| IdentityService    | keyPair(publicKey)        | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| IdentityService    | keyPair(privateKey)       | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| IdentityService    | keyPair(wif)              | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| MessageService     | sign                      | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| MessageService     | verify                    | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| PeerService        | all                       | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| PeerService        | allWithPlugin             | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |
| PeerService        | allWithoutEstimates       | :x: | :white_check_mark: | :x:  | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: |

## API Methods

- [ClientService](./services/client.md)
- [IdentityService](./services/identity.md)
- [LinkService](./services/link.md)
- [MessageService](./services/message.md)
- [PeerService](./services/peer.md)
- [TransactionService](./services/transaction.md)
