# Guia de Scripting do Nexus

Bem-vindo ao manual de desenvolvimento do Nexus. Este guia ensinará como criar drivers `.nx.js` para automatizar a web.

## 1. Anatomia de um Script

Um script Nexus é um arquivo JavaScript padrão (ES5+) que interage com o objeto global `Nexus`.

```javascript
/*
 * Metadados obrigatórios para o script ser reconhecido
 */
var meta = {
  name: "exemplo",
  version: "1.0",
  description: "Meu primeiro agente Nexus",
};

// Execução principal
var query = Nexus.sys.env("ARG1") || "padrao";
Nexus.tui.print("Rodando Exemplo com: " + query);
```

## 2. Referência da API

### `Nexus.http`

Faça requisições HTTP com gerenciamento automático de headers.

```javascript
var resp = Nexus.http.get("https://exemplo.com");
var json = Nexus.http.post("https://api.site.com", {
  headers: { Authorization: "Bearer ..." },
  body: JSON.stringify({ dado: 1 }),
});
```

### `Nexus.dom`

Faça o parse de respostas HTML.

```javascript
var html = Nexus.http.get("https://news.ycombinator.com").body;
var titles = Nexus.dom.select(html, ".titleline > a");

titles.forEach(function (el) {
  console.log(el.text(), el.attr("href"));
});
```

### `Nexus.tui`

Renderize saídas bonitas no terminal.

```javascript
Nexus.tui.header("Meu Dashboard");
Nexus.tui.table(
  ["ID", "Nome"],
  [
    [1, "Alice"],
    [2, "Bob"],
  ]
);
var nome = Nexus.tui.input("Qual é o seu nome?");
```

### `Nexus.sys`

Operações do sistema.

```javascript
Nexus.sys.save("dados.json", JSON.stringify(dados));
var existe = Nexus.sys.exists("config.json");
Nexus.sys.mkdir("downloads");
Nexus.sys.download("https://img.com/gato.jpg", "gato.jpg");
```

### `Nexus.secure` (Novo na v3.0)

Gerencie dados sensíveis com segurança.

```javascript
// Configuração (rodar uma vez)
Nexus.secure.set("api_key", "segredo_123");

// Uso
var key = Nexus.secure.get("api_key");
```

## 3. Melhores Práticas (Evasão Anti-Bot)

- Sempre defina headers **User-Agent** distintos se o alvo bloquear os genéricos.
- Use `Nexus.sys.wait(1000)` para delays aleatórios entre requisições (se disponível, ou loops de pausa).
- Não faça scraping muito rápido; respeite o `robots.txt`.

## 4. Publicando

Hospede seu script em uma URL (GitHub Raw é perfeito) e compartilhe!
Usuários podem instalar via:

```bash
nexus add @seu-script <url_raw>
```
