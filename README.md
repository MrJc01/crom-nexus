# Nexus: The Terminal Runtime for the Web

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Go](https://img.shields.io/badge/go-1.19+-00ADD8.svg)

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

### Linux / MacOS

```bash
curl -sL https://nexus.sh/install | bash
```

### Windows (PowerShell)

```powershell
iwr https://nexus.sh/install.ps1 -useb | iex
```

### Build from Source

```bash
git clone https://github.com/MrJc01/crom-nexus
cd crom-nexus
go build ./cmd/nexus
./nexus help
```

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
nexus run script.js
nexus exec "console.log('Hello World')"
```

### Managing Entities

```bash
nexus install @name      # Install
nexus list               # Show installed
nexus remove @name       # Uninstall
```

---

## 🤝 Contributing

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for internal details and [SCRIPTING_GUIDE.md](docs/SCRIPTING_GUIDE.md) to build your own agents.

License: MIT
