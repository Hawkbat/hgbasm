# hgbasm
A JavaScript-based compiler for RGBDS GameBoy assembly syntax variants.

If you're looking to use the compiler directly from the command line, see [hgbasm-cli](https://github.com/Hawkbat/hgbasm-cli).
A Visual Studio Code plugin will also be available after future milestones are completed.

Note that this project is not a perfect port of the RGBDS suite and is not guaranteed to accept every valid assembly file or generate binary-compatible output. However, issues related to compatibility will be addressed as they are reported, especially if there is no suitably trivial workaround available. Pull requests welcome.


## Features
HGBASM normally runs in an RGBDS-compatible mode with no new features enabled. To enable full HGBASM mode, add this directive to the top of your source file:
```
#mode hgbasm
```
In addition to normal RGBDS functionality, the following HGBASM-specific features are available:
### Additional Predefined Symbols

|Name|Type|Value|
|----|----|-----|
|`__HGBASM_MAJOR__`|`EQU`|Current HGBASM major version number|
|`__HGBASM_MINOR__`|`EQU`|Current HGBASM minor version number|
|`__HGBASM_PATCH__`|`EQU`|Current HGBASM patch version number|
|`TRUE`|`EQU`|1|
|`FALSE`|`EQU`|0|
|`true`|`EQU`|1|
|`false`|`EQU`|0|

## Status
- [X] Assembler (RGBASM equivalent)
- [X] Linker (RGBLINK equivalent)
- [X] Fixer (RGBFIX equivalent)
- [X] JS API (subject to change)
- [X] Command-line API for Node environments
- [ ] Language Server Protocol implementation
- [ ] Monaco web editor plugin
- [ ] Visual Studio Code extension

## Installation
`npm install --save hgbasm`

## Usage
Proper documentation will be added once the API is stable. The source code of [hgbasm-cli](https://github.com/Hawkbat/hgbasm-cli) shows basic usage of each of the main compiler components.

## Contribution
All feature requests, issues, and code contributions are welcome. Just clone the repo, make any changes to the TypeScript code in the `src/` directory, and submit a pull request.

## Credits
Thanks to the various contributors to the RGBDS suite; Donald Hays, creator of the existing RGBDS GBZ80 VSCode plugin; Beware, creator of the emulator BGB; and special thanks to the members of the gbdev Discord server, particularly ISSOtm and PinoBatch, for helping teach GameBoy development.

## License
MIT