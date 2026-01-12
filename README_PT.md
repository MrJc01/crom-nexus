# Nexus: O Runtime de Terminal para a Web

![Version](https://img.shields.io/badge/version-3.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Go](https://img.shields.io/badge/go-1.22+-00ADD8.svg)
[![CI](https://github.com/MrJc01/crom-nexus/actions/workflows/ci.yml/badge.svg)](https://github.com/MrJc01/crom-nexus/actions/workflows/ci.yml)

> "A Internet é o SO. O Nexus é o Kernel."

O Nexus é uma ferramenta CLI poderosa que transforma sites em APIs programáveis. Ele combina um motor de navegação "no-headless", um runtime JavaScript dedicado e uma TUI (Interface de Usuário em Terminal) para permitir que você navegue, faça scraping e automatize a web diretamente do seu terminal.

---

## ⚡ Início Rápido

```bash
# Execute uma busca rápida no Google
nexus @google search "golang" --json

# Verifique o clima
nexus @weather

# Instale uma nova capacidade
nexus install @hackernews
nexus @hackernews
```

## 📦 Instalação

### Linux / macOS

```bash
curl -sL https://raw.githubusercontent.com/MrJc01/crom-nexus/main/scripts/install.sh | bash
```

### Windows (PowerShell)

```powershell
iwr https://raw.githubusercontent.com/MrJc01/crom-nexus/main/scripts/install.ps1 -useb | iex
```

### Compilar do Código Fonte

```bash
git clone https://github.com/MrJc01/crom-nexus
cd crom-nexus
make build
./nexus help
```

### Download Direto

Baixe a última versão em [GitHub Releases](https://github.com/MrJc01/crom-nexus/releases/latest).

| Plataforma | Arquitetura | Arquivo |
|:-----------|:------------|:--------|
| Linux | x64 | `nexus-linux-amd64` |
| Linux | ARM64 | `nexus-linux-arm64` |
| macOS | x64 | `nexus-darwin-amd64` |
| macOS | Apple Silicon | `nexus-darwin-arm64` |
| Windows | x64 | `nexus-windows-amd64.exe` |

---

## 🚀 Funcionalidades

| Funcionalidade   | Descrição                                                          |
| :--------------- | :----------------------------------------------------------------- |
| **Cliente HTTP** | Buscador HTTP inteligente com técnicas de evasão anti-bot.         |
| **Parser DOM**   | Sintaxe estilo jQuery (`Nexus.dom.select`) para extração de dados. |
| **Runtime JS**   | Suporte completo a JavaScript ES5+ (via Goja).                     |
| **Motor TUI**    | Interface rica no terminal para scripts interativos.               |
| **Registry**     | Instale scripts da comunidade com `nexus install @nome`.           |
| **Vault**        | Armazene tokens e segredos com segurança via `Nexus.secure`.       |

---

## 🛠️ Uso

### Executando Scripts

```bash
nexus run script.js          # Executar arquivo
nexus exec "console.log(1)"  # Executar JS inline
echo "Nexus.tui.print('Oi')" | nexus run -  # Executar via stdin
```

### Gerenciando Entidades

```bash
nexus install @nome      # Instalar
nexus list               # Listar instalados
nexus remove @nome       # Desinstalar
```

### Formatos de Saída

```bash
nexus @ip --json         # Saída JSON
nexus @ip --tui          # Interface Terminal (padrão)
nexus @ip --md           # Saída Markdown
```

---

## 🧪 Desenvolvimento

```bash
# Executar todos os testes
make test

# Executar apenas testes Go
make test-go

# Executar linter
make lint

# Compilar para todas as plataformas
make build-all

# Gerar relatório de cobertura
make coverage
```

---

## 📖 Documentação

- [Guia de Arquitetura](docs/ARCHITECTURE_PT.md) - Funcionamento interno
- [Guia de Scripts](docs/SCRIPTING_GUIDE_PT.md) - Crie seus próprios scripts
- [Relatório de Testes](docs/TEST_REPORT_PT.md) - Validação v3.0
- [Changelog](CHANGELOG.md) - Histórico de versões

---

## 🤝 Contribuindo

1. Faça um Fork do repositório
2. Crie sua branch de feature (`git checkout -b feature/incrivel`)
3. Commit suas mudanças (`git commit -m 'Adiciona feature incrível'`)
4. Push para a branch (`git push origin feature/incrivel`)
5. Abra um Pull Request

Veja [ARCHITECTURE_PT.md](docs/ARCHITECTURE_PT.md) para detalhes internos.

---

## 📄 Licença

Licença MIT - veja [LICENSE](LICENSE) para detalhes.
