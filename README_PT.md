# Nexus: O Runtime de Terminal para a Web

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Go](https://img.shields.io/badge/go-1.19+-00ADD8.svg)

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

### Linux / MacOS

```bash
curl -sL https://nexus.sh/install | bash
```

### Windows (PowerShell)

```powershell
iwr https://nexus.sh/install.ps1 -useb | iex
```

### Compilar do Código Fonte

```bash
git clone https://github.com/MrJc01/crom-nexus
cd crom-nexus
go build ./cmd/nexus
./nexus help
```

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
nexus run script.js
nexus exec "console.log('Olá Mundo')"
```

### Gerenciando Entidades

```bash
nexus install @nome      # Instalar
nexus list               # Listar instalados
nexus remove @nome       # Desinstalar
```

---

## 🤝 Contribuindo

Veja [ARCHITECTURE_PT.md](docs/ARCHITECTURE_PT.md) para detalhes internos e [SCRIPTING_GUIDE_PT.md](docs/SCRIPTING_GUIDE_PT.md) para criar seus próprios agentes.

Confira o [Relatório de Testes](docs/TEST_REPORT_PT.md) para validação da versão v3.0.

Licença: MIT
