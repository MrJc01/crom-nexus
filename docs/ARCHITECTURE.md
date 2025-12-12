# Nexus Architecture Guide

This document explains the internal workings of the Nexus Core (Go) and how it interfaces with the Javascript Runtime.

## High-Level Overview

```mermaid
graph TD
    A[CLI Input (Go)] --> B{Router (cmd/nexus)};
    B -->|run/exec| C[Runtime (internal/runtime)];
    B -->|install| D[Registry Manager];
    C --> E[Goja VM (JS Engine)];
    E --> F[API Modules (internal/api)];
    F --> G[HTTP / IO / TUI];
```

## Key Components

### 1. The Core (`cmd/nexus`)

The entry point. Parses flags (`--json`, `--tui`) and commands. It initializes the `ConfigManager` to load `~/.nexus/config.json`.

### 2. The Runtime (`internal/runtime`)

Wraps the `dop251/goja` VM.

- **Dependency Injection**: It injects Go functions as JS objects (`Nexus.http`, etc.).
- **Error Handling**: Captures panic and JS exceptions, displaying them prettily.

### 3. API Modules (`internal/api`)

- **HTTP**: Uses `net/http`.
- **DOM**: Uses `goquery` for selection.
- **TUI**: Uses `charmbracelet/lipgloss` and `bubbletea` for styling.
- **Sys**: Filesystem access restricted to the working directory (mostly).
- **Secure**: AES-256-GCM encryption for the Vault.

## Design Philosophy

### "No-Headless"

Nexus is **NOT** a browser wrapper (like Puppeteer). This is intentional to keep binary size small (<15MB) and performance high. We parse HTML strings, we don't render DOM.

### "Unix Philosophy"

Everything should be pipeable. That's why every command supports `--json`.

```bash
nexus @stock --json | jq .price
```
