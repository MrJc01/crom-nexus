# Guia de Arquitetura do Nexus

Este documento explica o funcionamento interno do Nexus Core (Go) e como ele interage com o Runtime Javascript.

## Visão Geral

```mermaid
graph TD
    A[Entrada CLI (Go)] --> B{Roteador (cmd/nexus)};
    B -->|run/exec| C[Runtime (internal/runtime)];
    B -->|install| D[Gerenciador de Registro];
    C --> E[VM Goja (Motor JS)];
    E --> F[Módulos da API (internal/api)];
    F --> G[HTTP / IO / TUI];
```

## Componentes Chave

### 1. O Core (`cmd/nexus`)

O ponto de entrada. Analisa flags (`--json`, `--tui`) e comandos. Inicializa o `ConfigManager` para carregar `~/.nexus/config.json`.

### 2. O Runtime (`internal/runtime`)

Envolve a VM `dop251/goja`.

- **Injeção de Dependência**: Injeta funções Go como objetos JS (`Nexus.http`, etc.).
- **Tratamento de Erros**: Captura panic e exceções JS, exibindo-as de forma elegante.

### 3. Módulos da API (`internal/api`)

- **HTTP**: Usa `net/http`.
- **DOM**: Usa `goquery` para seleção.
- **TUI**: Usa `charmbracelet/lipgloss` e `bubbletea` para estilização.
- **Sys**: Acesso ao sistema de arquivos restrito ao diretório de trabalho (na maior parte).
- **Secure**: Criptografia AES-256-GCM para o Cofre (Vault).

## Filosofia de Design

### "No-Headless"

O Nexus **NÃO** é um wrapper de navegador (como o Puppeteer). Isso é intencional para manter o tamanho do binário pequeno (<15MB) e a performance alta. Nós processamos strings HTML, não renderizamos o DOM visualmente.

### "Filosofia Unix"

Tudo deve ser encadeável (pipeable). É por isso que todo comando suporta `--json`.

```bash
nexus @stock --json | jq .price
```
