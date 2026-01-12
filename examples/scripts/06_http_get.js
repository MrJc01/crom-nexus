// =====================================================
// 06_http_get.js - Requisições GET
// Demonstra: Nexus.http.get para buscar dados
// =====================================================

Nexus.tui.title("Requisições HTTP GET");

Nexus.tui.markdown("## Exemplo 1: GET Simples");

try {
    // GET básico retorna {status, body}
    var response = Nexus.http.get("https://httpbin.org/json");

    Nexus.tui.success("Status: " + response.status);
    Nexus.tui.info("Corpo da resposta (primeiros 200 chars):");
    Nexus.tui.print(response.body.substring(0, 200) + "...");
} catch (e) {
    Nexus.tui.error("Erro na requisição: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 2: Parsing JSON");

try {
    var resp = Nexus.http.get("https://jsonplaceholder.typicode.com/users/1");

    if (resp.status === 200) {
        var user = JSON.parse(resp.body);

        Nexus.tui.success("Usuário carregado com sucesso!");
        Nexus.tui.table(
            ["Campo", "Valor"],
            [
                ["ID", user.id.toString()],
                ["Nome", user.name],
                ["Username", user.username],
                ["Email", user.email],
                ["Cidade", user.address.city]
            ]
        );
    }
} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 3: Múltiplas Requisições");

var urls = [
    "https://jsonplaceholder.typicode.com/posts/1",
    "https://jsonplaceholder.typicode.com/posts/2",
    "https://jsonplaceholder.typicode.com/posts/3"
];

var results = [];
for (var i = 0; i < urls.length; i++) {
    try {
        var r = Nexus.http.get(urls[i]);
        var post = JSON.parse(r.body);
        results.push([post.id.toString(), post.title.substring(0, 40) + "..."]);
    } catch (e) {
        results.push([(i + 1).toString(), "Erro: " + e]);
    }
}

Nexus.tui.table(["ID", "Título"], results);

Nexus.tui.box("✅ Exemplos de HTTP GET concluídos!");
