# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 10.2.16 - 2021-06-29

### Added

- **[LSK]** Implement `WIFService` (6d7cb1d6, @faustbrian)

### Changed

- **[SDK]** Implement command to update feature flags in manifests (b102a07f, @faustbrian)

### Fixed

- **[ARK]** Return maximum fee as minimum and average for multi-payments (f2317231, @faustbrian)

## 10.2.13 - 2021-06-28

### Fixed

- **[MARKET]** Correct coincap daily average (5f32f299, @faustbrian)

## 10.2.12 - 2021-06-28

### Fixed

- **[PROFILES]** Respect word count for wallet generation when passed in (dc50e777, @faustbrian)

## 10.2.11 - 2021-06-28

### Added

- **[PROFILES]** Expose word count for BIP39 passphrases (29969e3b, @faustbrian)

## 10.2.10 - 2021-06-28

### Added

- **[SDK]** Implement methods to identify ledger device model (5d0eccda, @faustbrian)

## 10.2.9 - 2021-06-28

### Fixed

- **[ARK]** Remove `multiSignature.ledgerS` flag (cf53b3e6, @faustbrian)

## 10.2.8 - 2021-06-28

### Fixed

- **[ARK]** Ensure ledger public key is associated with MuSig (cab2fe09, @faustbrian)

## 10.2.7 - 2021-06-28

### Added

- **[LSK]** Implement second WIF support for MuSig signing (f114e812, @faustbrian)
- **[ARK]** Add final MuSig signature with ledger (633549ce, @faustbrian)
- **[ARK]** Add MuSig participant signature with ledger (cdd2f0e1, @faustbrian)

## 10.2.3 - 2021-06-25

### Fixed

- **[LSK]** Remove multi-signature transaction flag (995b5388, @faustbrian)

## 10.2.2 - 2021-06-25

### Fixed

- **[LSK]** Set `recipientId` before ledger signing (5972e68a, @faustbrian)

## 10.2.1 - 2021-06-25

### Fixed

- **[ARK]** Compendia testnet host (eac533cf, @faustbrian)

## 10.2.0 - 2021-06-25

### Changed

- **[SDK]** Consolidate confirmed transaction DTOs (fc86bb0a, @faustbrian)

## 10.1.20 - 2021-06-24

### Fixed

- **[PROFILES]** Add missing methods to `ExtendedSignedTransactionData` (0a9e2c48, @faustbrian)

## 10.1.19 - 2021-06-24

### Changed

- **[SDK]** Stop normalising broadcasting errors (b7a1e9dd, @faustbrian)

### Fixed

- **[PROFILES]** Add missing methods to `ExtendedSignedTransactionData` (46d0718c, @faustbrian)

## 10.1.18 - 2021-06-24

### Fixed

- **[PROFILES]** Multi signature registration process (00eb172f, @faustbrian)

## 10.1.17 - 2021-06-24

### Changed

- **[ARK]** Throw an exception if invalid signatory is used for `addSignature` (aa3e856f, @faustbrian)
- **[SDK]** Return transaction broadcasting error as string (603450c5, @faustbrian)

### Fixed

- **[PROFILES]** Pass plain object to multi-signature broadcaster (ab990540, @faustbrian)

## 10.1.14 - 2021-06-23

### Added

- **[SDK]** Indicate if an import method can be encrypted (395e7df0, @faustbrian)

## 10.1.13 - 2021-06-23

### Fixed

- **[ARK]** Correct multi-payment recipient count (d3f068da, @faustbrian)

## 10.1.12 - 2021-06-23

### Fixed

- **[ARK]** Derive address for nonce with second signature (892b7aca, @faustbrian)

## 10.1.11 - 2021-06-23

### Added

- **[SDK]** Expose number of multi payment recipients (dd6c449e, @faustbrian)

## 10.1.10 - 2021-06-23

### Fixed

- **[SDK]** Always use `BigNumberService` for `BigNumber` creation in DTOs (45a6060e, @faustbrian)

## 10.1.9 - 2021-06-22

### Fixed

- **[PROFILES]** Normalise multi-payment amounts (d9859690, @faustbrian)

## 10.1.8 - 2021-06-22

### Fixed

- **[PROFILES]** Handle edge-case where confirmations come back as 0 from APIs (2ad8b2c2, @faustbrian)

## 10.1.7 - 2021-06-22

### Added

- **[PROFILES]** Implement password removal (3faca55a, @faustbrian)

### Changed

- **[ARK]** Use maximum fee as static and maximum (ef47e6e5, @w3ea)

### Fixed

- **[ARK]** **[LSK]** Confirm ARK and LSK as soon as the transaction is on-chain (51ea3446, @faustbrian)

## 10.1.4 - 2021-06-21

### Changed

- **[PROFILES]** Export `Wallet` class (392db724, @faustbrian)

## 10.1.3 - 2021-06-21

### Changed

- **[PROFILES]** Export `Profile` class (d4de6770, @faustbrian)

## 10.1.2 - 2021-06-21

### Changed

- **[PROFILES]** Proxy temporary `SignedTransactionData` methods and normalise their output (b9b904a3, @faustbrian)

## 10.1.1 - 2021-06-21

### Changed

- **[SDK]** Temporarily expose username, hash and recipients through `SignedTransactionData` (a415c8cc, @faustbrian)

## 10.1.0 - 2021-06-20

### Added

- **[JSON-RPC]** Implement `business.withdrawal` (d1e6629c, @faustbrian)

### Changed

- **[INTL]** Make Numeral `locale` optional (c173f549, @alesmit)

### Fixed

- **[SDK]** Create `WalletData` through `DataTransferObjectService` (baec0781, @faustbrian)

## 10.0.4 - 2021-06-18

### Fixed

- **[PROFILES]** Handle all expiration errors (c0cc13c3, @faustbrian)

## 10.0.3 - 2021-06-18

### Fixed

- **[PROFILES]** Export `ExtendedSignedTransactionData` (93bb6a5f, @faustbrian)

## 10.0.2 - 2021-06-18

### Changed

- **[PROFILES]** Normalise signed data through `ExtendedSignedTransactionData` (8170a9b3, @faustbrian)

## 10.0.1 - 2021-06-17

### Fixed

- **[PROFILES]** Prevent duplicate DTO transformation in `TransactionAggregate` (04e86745, @faustbrian)

## 10.0.0 - 2021-06-17

### Changed

- **[SDK]** Treat balances, amounts and fees as numbers (9255267e, @faustbrian)
