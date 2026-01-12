# Nexus: The Terminal Runtime for the Web

![Version](https://img.shields.io/badge/version-3.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Go](https://img.shields.io/badge/go-1.22+-00ADD8.svg)
[![CI](https://github.com/MrJc01/crom-nexus/actions/workflows/ci.yml/badge.svg)](https://github.com/MrJc01/crom-nexus/actions/workflows/ci.yml)

> "The Internet is the OS. Nexus is the Kernel."

Nexus is a powerful CLI tool that turns websites into programmable APIs. It combines a headless-free navigation engine, a dedicated JavaScript runtime, and a TUI (Text User Interface) to let you browse, scrape, and automate the web from your terminal.

---

## ⚡ Quick Start

```bash
# Run a quick Google search
nexus @google search "golang" --json

# Check the weather
nexus @weather

# Install a new capability
nexus install @hackernews
nexus @hackernews
```

## 📦 Installation

### Linux / macOS

```bash
curl -sL https://raw.githubusercontent.com/MrJc01/crom-nexus/main/scripts/install.sh | bash
```

### Windows (PowerShell)

```powershell
iwr https://raw.githubusercontent.com/MrJc01/crom-nexus/main/scripts/install.ps1 -useb | iex
```

### Build from Source

```bash
git clone https://github.com/MrJc01/crom-nexus
cd crom-nexus
make build
./nexus help
```

### Download Binary

Download the latest release from [GitHub Releases](https://github.com/MrJc01/crom-nexus/releases/latest).

| Platform | Architecture | Download |
|:---------|:-------------|:---------|
| Linux | x64 | `nexus-linux-amd64` |
| Linux | ARM64 | `nexus-linux-arm64` |
| macOS | x64 | `nexus-darwin-amd64` |
| macOS | Apple Silicon | `nexus-darwin-arm64` |
| Windows | x64 | `nexus-windows-amd64.exe` |

---

## 🚀 Features

| Feature         | Description                                                  |
| :-------------- | :----------------------------------------------------------- |
| **HTTP Client** | Smart HTTP fetcher with anti-bot evasion techniques.         |
| **DOM Parser**  | jQuery-like syntax (`Nexus.dom.select`) for extracting data. |
| **JS Runtime**  | Full ES5+ Javascript support (powered by Goja).              |
| **TUI Engine**  | Rich Terminal User Interface for interactive scripts.        |
| **Registry**    | Install community scripts with `nexus install @name`.        |
| **Vault**       | Securely store tokens and secrets with `Nexus.secure`.       |

---

## 🛠️ Usage

### Running Scripts

```bash
nexus run script.js          # Run a script file
nexus exec "console.log(1)"  # Execute inline JS
echo "Nexus.tui.print('Hi')" | nexus run -  # Execute from stdin
```

### Managing Entities

```bash
nexus install @name      # Install
nexus list               # Show installed
nexus remove @name       # Uninstall
```

### Output Formats

```bash
nexus @ip --json         # JSON output
nexus @ip --tui          # Terminal UI (default)
nexus @ip --md           # Markdown output
```

---

## 🧪 Development

```bash
# Run all tests
make test

# Run only Go unit tests
make test-go

# Run linter
make lint

# Build for all platforms
make build-all

# Generate coverage report
make coverage
```

---

## 📖 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md) - Internal workings
- [Scripting Guide](docs/SCRIPTING_GUIDE.md) - Write your own scripts
- [Changelog](CHANGELOG.md) - Version history

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for internal details.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
