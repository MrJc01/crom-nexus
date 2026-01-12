# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- GitHub Actions CI/CD pipeline
- Automated release workflow
- Cross-platform installation scripts
- Unit tests for all API modules

## [3.0.0] - 2025-12-12

### Added
- **Secure Module** (`Nexus.secure`) - AES-256-GCM encrypted vault for storing secrets
- **Stdin Execution** - Execute scripts from pipe with `nexus run -`
- **Inline Execution** - Run JS code directly with `nexus exec "code"`
- **Argument Injection** - Scripts can access CLI args via `__args__` global
- **Output Formats** - Support for `--json`, `--tui`, and `--md` output modes
- **Retry Logic** - HTTP client now retries failed requests with exponential backoff
- **Timeout Configuration** - Configurable HTTP timeout via `Nexus.http.setTimeout()`

### Changed
- Improved TUI styling with Lipgloss
- Enhanced error messages with formatted output
- Better markdown rendering with Glamour

### Fixed
- CLI argument parsing for entity scripts
- TUI header rendering in various terminal sizes

## [2.0.0] - 2025-11-01

### Added
- **TUI Module** (`Nexus.tui`) - Rich terminal UI with tables, boxes, markdown
- **SYS Module** (`Nexus.sys`) - File system operations (save, load, mkdir, download)
- **DOM Module** (`Nexus.dom`) - jQuery-like HTML parsing with goquery
- **Registry System** - Install community scripts with `nexus install @name`
- **Entity System** - Run scripts as entities with `nexus @name`

### Changed
- Complete rewrite of runtime engine
- Switched from otto to goja for better ES5+ support

## [1.0.0] - 2025-10-01

### Added
- Initial release
- Basic HTTP client (`Nexus.http`)
- Script execution (`nexus run script.js`)
- Configuration management (`~/.nexus/config.json`)

[Unreleased]: https://github.com/MrJc01/crom-nexus/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/MrJc01/crom-nexus/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/MrJc01/crom-nexus/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/MrJc01/crom-nexus/releases/tag/v1.0.0
