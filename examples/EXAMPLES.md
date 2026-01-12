# Nexus API - Guia de Exemplos

Este diretório contém exemplos práticos de como usar a API do Nexus. Cada exemplo demonstra uma ou mais funcionalidades específicas.

---

## 📦 Módulos Disponíveis

| Módulo | Namespace | Descrição |
|--------|-----------|-----------|
| **HTTP** | `Nexus.http` | Cliente HTTP com suporte a cookies e retry |
| **DOM** | `Nexus.dom` | Parser HTML com seletores CSS (estilo jQuery) |
| **TUI** | `Nexus.tui` | Interface de Texto Rica (Terminal UI) |
| **SYS** | `Nexus.sys` | Operações de sistema de arquivos |
| **Secure** | `Nexus.secure` | Armazenamento seguro de credenciais |

---

## 🚀 Como Executar

```bash
# Executar um exemplo específico
nexus run examples/scripts/01_hello_world.js

# Executar todos os exemplos básicos
nexus run examples/scripts/run_basic_examples.js

# Executar com saída JSON
nexus run examples/scripts/01_hello_world.js --json
```

---

## 📚 Lista de Exemplos

### 🔰 Básicos (01-05)

| # | Arquivo | Descrição |
|---|---------|-----------|
| 01 | `01_hello_world.js` | Introdução ao Nexus - Hello World |
| 02 | `02_console_colors.js` | Cores e formatação no terminal |
| 03 | `03_styled_output.js` | Mensagens estilizadas (success, error, info) |
| 04 | `04_markdown_render.js` | Renderização de Markdown no terminal |
| 05 | `05_tables.js` | Tabelas formatadas |

### 🌐 HTTP Client (06-10)

| # | Arquivo | Descrição |
|---|---------|-----------|
| 06 | `06_http_get.js` | Requisições GET básicas |
| 07 | `07_http_post.js` | Envio de dados via POST |
| 08 | `08_http_custom_headers.js` | Headers personalizados |
| 09 | `09_http_cookies.js` | Persistência de cookies |
| 10 | `10_http_timeout_retry.js` | Configuração de timeout e retry |

### 📄 DOM Parser (11-13)

| # | Arquivo | Descrição |
|---|---------|-----------|
| 11 | `11_dom_parse.js` | Parsing básico de HTML |
| 12 | `12_dom_selectors.js` | Seletores CSS avançados |
| 13 | `13_dom_extract_data.js` | Extração de dados estruturados |

### 💾 Sistema de Arquivos (14-16)

| # | Arquivo | Descrição |
|---|---------|-----------|
| 14 | `14_sys_save_load.js` | Salvar e carregar arquivos |
| 15 | `15_sys_json.js` | Persistência de objetos JSON |
| 16 | `16_sys_directories.js` | Manipulação de diretórios |

### 🔐 Segurança (17-18)

| # | Arquivo | Descrição |
|---|---------|-----------|
| 17 | `17_secure_vault.js` | Armazenamento seguro de segredos |
| 18 | `18_secure_api_keys.js` | Gerenciamento de API Keys |

### 🎯 Projetos Práticos (19-25)

| # | Arquivo | Descrição |
|---|---------|-----------|
| 19 | `19_weather_cli.js` | CLI de previsão do tempo |
| 20 | `20_web_scraper.js` | Web scraper básico |
| 21 | `21_todo_app.js` | Aplicativo de lista de tarefas |
| 22 | `22_api_monitor.js` | Monitor de APIs REST |
| 23 | `23_data_export.js` | Exportação de dados para CSV/JSON |
| 24 | `24_interactive_menu.js` | Menu interativo com inputs |
| 25 | `25_complete_workflow.js` | Workflow completo integrando todas APIs |

---

## 🛠️ Referência Rápida da API

### Nexus.http

```javascript
// GET
var resp = Nexus.http.get("https://api.example.com/data");
console.log(resp.status, resp.body);

// POST
var resp = Nexus.http.post("https://api.example.com/data", JSON.stringify({key: "value"}));

// Request customizado
var resp = Nexus.http.request({
    method: "PUT",
    url: "https://api.example.com/data",
    headers: {"Authorization": "Bearer token"},
    body: JSON.stringify({data: "test"})
});

// Configurações
Nexus.http.setTimeout(10000);  // 10 segundos
Nexus.http.setRetries(5);      // 5 tentativas
```

### Nexus.dom

```javascript
var doc = Nexus.dom.parse("<html>...");
var elements = doc.select(".class");     // Retorna array
var text = elements[0].text();           // Texto do elemento
var attr = elements[0].attr("href");     // Atributo
var html = elements[0].html();           // HTML interno
```

### Nexus.tui

```javascript
// Mensagens estilizadas
Nexus.tui.print("texto", "color");       // Cores: success, error, info, warn, title
Nexus.tui.success("Sucesso!");
Nexus.tui.error("Erro!");
Nexus.tui.info("Informação");
Nexus.tui.warn("Aviso");
Nexus.tui.title("Título Principal");

// Formatação
Nexus.tui.markdown("## Heading\n**bold** *italic*");
Nexus.tui.table(["Col1", "Col2"], [["Val1", "Val2"], ["Val3", "Val4"]]);
Nexus.tui.box("Texto em uma caixa");

// Interativo
var input = Nexus.tui.input("Digite algo:");
var password = Nexus.tui.input("Senha:", {mask: true});
var choice = Nexus.tui.list("Escolha:", ["Opção 1", "Opção 2"]);
var confirmed = Nexus.tui.confirm("Tem certeza?");
```

### Nexus.sys

```javascript
// Arquivos
Nexus.sys.save("file.txt", "conteúdo");
var content = Nexus.sys.load("file.txt");
var exists = Nexus.sys.exists("file.txt");
var removed = Nexus.sys.remove("file.txt");

// Diretórios
var success = Nexus.sys.mkdir("pasta");
var files = Nexus.sys.listDir(".");      // Array de {name, isDir, size}

// Sistema
var value = Nexus.sys.env("HOME");       // Variável de ambiente
Nexus.sys.open("https://google.com");    // Abre no navegador
Nexus.sys.download("url", "filename");   // Download de arquivo
```

### Nexus.secure

```javascript
// Armazenamento seguro (criptografado)
Nexus.secure.set("api_key", "sk-12345");
var key = Nexus.secure.get("api_key");
```

---

## 💡 Dicas

1. **Sempre use try/catch** para operações de rede
2. **Verifique o status** das respostas HTTP
3. **Use JSON.stringify/parse** para objetos
4. **Arquivos são salvos em** `~/.nexus/`
5. **Credenciais são criptografadas** com AES-256

---

## 📖 Mais Informações

- [Documentação Completa](../../docs/SCRIPTING_GUIDE.md)
- [Arquitetura](../../docs/ARCHITECTURE.md)
- [Scripts da Registry](../../nexus-scripts/)
