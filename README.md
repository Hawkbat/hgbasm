# gbasm.js
A JavaScript-based compiler for RGBDS GameBoy assembly syntax variants.

Note that this project is not a perfect port of the RGBDS suite and is not guaranteed to accept every valid assembly file or generate binary-compatible output. However, issues related to compatibility will be addressed as they are reported, especially if there is no suitably trivial workaround available. Pull requests welcome.

## Status
- [X] Assembler (RGBASM equivalent)
- [X] Linker (RGBLINK equivalent)
- [X] Fixer (RGBFIX equivalent)
- [X] JS API (subject to change)
- [ ] Command-line API for Node environments
- [ ] Language Server Protocol implementation
- [ ] Monaco web editor plugin
- [ ] Visual Studio Code extension

## Installation
An NPM package and Visual Studio Code plugin will be available after future milestones are completed.

## Usage
For now, can only be used directly from the source. See `src/main.ts` for an example of configuring and invoking the compiler using Node.

## Contribution
All feature requests, issues, and code contributions are welcome. Just clone the repo, make any changes to the TypeScript code in the `src/` directory, and submit a pull request.

## Credits
Thanks to the various contributors to the RGBDS suite; Donald Hays, creator of the existing RGBDS GBZ80 VSCode plugin; Beware, creator of the emulator BGB; and special thanks to the members of the gbdev Discord server, particularly ISSOtm and PinoBatch, for helping teach GameBoy development.

## License
MIT