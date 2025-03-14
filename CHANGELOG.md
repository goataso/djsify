## [1.7.4] - 2024-03-14
### Fixed
- Fixed an issue where messageCreate event handler did not properly process commands when command.data.content was defined as an array

## [1.7.3] - 2024-02-07
- Improved error handling

## [1.7.2] - 2024-02-07
- Fixed a problem with Es module loading

## [1.7.1] - 2024-02-07
- Fixed a bug where bot cannot load .js Commands

## [1.7.0] - 2024-02-07
### Added
- preCommandHook option
- Better types and flexibility

### Improved
- Performance optimizations

## [1.6.9] - [1.6.3]
### Fixed
- Various bug fixes

## [1.6.2]
### Added
- Additional options

## [1.6.1]
### Added
- New configuration options:
  ```ts
  allowDm: boolean,
  allowedGuilds: string[] | string | null,
  isPrivateBot: boolean, // won't interact with anyone except in the allowed guilds

  // these options can be edited later from the same instance
  ```

### Changed
- Deprecated prefix functionality

### Improved
- Error handling enhancements

## [1.6.0] - [1.5.7]
### Improved
- TypeScript support

## [1.5.7] - [1.3]
### Fixed
- Various bug fixes

### Improved
- AI support enhancements
- Error handling improvements