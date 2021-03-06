# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 6.1.8 - 2021-05-11

### Fixed

- **[ATOM]** Get wallet balance from bank endpoint (5d13486a, @faustbrian)

### Changed

- **[ATOM]** Replace mainnet peer (9db4f965, @faustbrian)
- **[ATOM]** Remove terra coin (4df125d6, @faustbrian)

## 6.1.5 - 2021-05-11

### Added

- **[PROFILES]** Implement `IPasswordManager#forget` (00188ffa, @goga-m)
- **[PROFILES]** Create complete tutorial function (a3f8b2c4, @w3ea)

### Fixed

- **[ARK]** Use of network expiration (5c5c08be, @marianogoldman)
- **[ZIL]** Treat bech32 addresses as valid and turn balance into satoshi (3bb8aa08, @faustbrian)

## 6.0.34 - 2021-05-10

### Changed

- **[BTC]** Default to BIP84 derivation (b0e168d3, @faustbrian)
- **[ARK]** Estimate transaction expiration if none is specified (04a04048, @faustbrian)
- **[EGLD]** Return some default fees (790fab0d, @faustbrian)

## 6.0.29 - 2021-05-07

### Changed

- **[TRX]** Throw an exception if the archival host is `undefined` (1a2c5f02, @faustbrian)

### Fixed

- **[SDK]** Merge default network manifest and stored manifest (b8682dc2, @faustbrian)

## 6.0.27 - 2021-05-07

### Fixed

- **[TRX]** Handle empty values within transaction data (6a3b6114, @faustbrian)

## 6.0.26 - 2021-05-07

### Added

- **[TRX]** Implement `ClientService#transactions` (033d8a26, @faustbrian)

## 6.0.25 - 2021-05-07

### Fixed

- **[XRP]** Look up specific address or first address (1505e518, @faustbrian)
- **[XRP]** Grab amount for new field (5bc1c7b3, @faustbrian)
- **[XRP]** Use correct explorer paths (1738e3fb, @faustbrian)

## 6.0.22 - 2021-05-07

### Fixed

- **[EGLD]** Divide balance by `1e18` (9b88c7b9, @faustbrian)
- **[TRX]** Multi wallet balance by `1e2` (ecf0b0d3, @faustbrian)
- **[XRP]** Return `undefined` for unavailable values (cb382288, @faustbrian)

## 6.0.19 - 2021-05-07

### Fixed

- Return default values for methods that are always called (eecc3a1d, @faustbrian)

## 6.0.18 - 2021-05-06

### Changed

- **[PROFILES]** Allow BIP49 and BIP84 as import methods (b75a048a, @faustbrian)

## 6.0.17 - 2021-05-06

### Fixed

- **[PROFILES]** Avoid shared data repository for coin service (127f3c06, @faustbrian)

## 6.0.16 - 2021-05-06

### Fixed

- **[PROFILES]** Create coin instance if necessary for contact address (a91dd9b3, @faustbrian)

## 6.0.15 - 2021-05-06

### Fixed

- **[LSK]** Cast amount to string (ad6b7a1f, @faustbrian)

## 6.0.14 - 2021-05-06

### Fixed

- **[PROFILES]** Return `undefined` if `estimateExpiration` is not supported (ebe39c10, @faustbrian)

## 6.0.13 - 2021-05-06

### Changed

- **[SDK]** Allow `estimateExpiration` to return undefined (1317034a, @faustbrian)

## 6.0.12 - 2021-05-06

### Changed

- **[PROFILES]** Use symbols as container binding keys (fc40c40b, @faustbrian)
- **[PROFILES]** Use constructor injection for profile (af88ae36, @faustbrian)
- **[SDK]** Expose parent coin through network (70eaafa1, @faustbrian)

## 6.0.9 - 2021-05-04

### Changed

- **[PROFILES]** Bind password manager to profile instance (92df8c4d, @faustbrian)

## 6.0.8 - 2021-05-03

### Added

- **[PROFILES]** Implement `IProfileRepository#tap` (2056a696, @faustbrian)
- **[PROFILES]** Implement `IProfile#hasCompletedTutorial` (5d996bfd, @w3ea)

### Changed

- **[PROFILES]** Remove duplicate name type check (417fd34b, @w3ea)

## 6.0.5 - 2021-04-30

### Added

- **[ARK-MUSIG]** Initial implementation (cf56c978, @faustbrian)

### Changed

- **[PROFILES]** Store import method on wallet (f590fe84, @faustbrian)
- **[SDK]** Only require account index for BIP44 arguments (a3732e86, @faustbrian)
- **[PROFILES]** Implement extended public key import from mnemonics (0284fca7, @faustbrian)

## 6.0.1 - 2021-04-29

### Changed

- **[NEO]** Update host lists (a0baa643, @faustbrian)

## 6.0.0 - 2021-04-28

### Added

- **[PROFILES]** **[BREAKING]** Save environment on change (a38ad46f, @faustbrian)

### Changed

- **[NEO]** **[BREAKING]** Only validate address length (41298729, @faustbrian)
- **[SDK]** **[BREAKING]** Treat magistrate as a generic transaction (918ea403, @faustbrian)
- **[SDK]** **[BREAKING]** Remove magistrate remnants (1efc4197, @faustbrian)
