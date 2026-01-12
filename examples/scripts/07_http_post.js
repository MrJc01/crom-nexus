// =====================================================
// 07_http_post.js - Envio de Dados via POST
// Demonstra: Nexus.http.post para enviar dados
// =====================================================

Nexus.tui.title("Requisições HTTP POST");

Nexus.tui.markdown("## Exemplo 1: POST com JSON");

try {
    // Criar objeto de dados
    var userData = {
        name: "João Silva",
        email: "joao@example.com",
        age: 30,
        active: true
    };

    // POST precisa de JSON stringificado
    var response = Nexus.http.post(
        "https://httpbin.org/post",
        JSON.stringify(userData)
    );

    if (response.status === 200) {
        Nexus.tui.success("POST realizado com sucesso!");

        // httpbin retorna os dados que recebeu
        var result = JSON.parse(response.body);
        Nexus.tui.info("Dados recebidos pelo servidor:");
        Nexus.tui.print(result.data);
    }
} catch (e) {
    Nexus.tui.error("Erro no POST: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 2: Simulando Login");

try {
    var credentials = {
        username: "admin",
        password: "secret123"
    };

    var loginResp = Nexus.http.post(
        "https://httpbin.org/post",
        JSON.stringify(credentials)
    );

    if (loginResp.status === 200) {
        var body = JSON.parse(loginResp.body);
        Nexus.tui.success("Login simulado!");
        Nexus.tui.table(
            ["Cabeçalho", "Valor"],
            [
                ["Content-Type", body.headers["Content-Type"] || "N/A"],
                ["User-Agent", body.headers["User-Agent"].substring(0, 30)]
            ]
        );
    }
} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 3: Enviando Array de Dados");

try {
    var items = [
        { id: 1, name: "Produto A", price: 99.90 },
        { id: 2, name: "Produto B", price: 149.90 },
        { id: 3, name: "Produto C", price: 249.90 }
    ];

    var resp = Nexus.http.post(
        "https://httpbin.org/post",
        JSON.stringify({ items: items, total: 3 })
    );

    if (resp.status === 200) {
        Nexus.tui.success("Array enviado com sucesso!");
        Nexus.tui.info("Total de itens: " + items.length);
    }
} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.box("✅ Exemplos de HTTP POST concluídos!");
