// =====================================================
// 08_http_custom_headers.js - Headers Personalizados
// Demonstra: Nexus.http.request com headers customizados
// =====================================================

Nexus.tui.title("HTTP com Headers Personalizados");

Nexus.tui.markdown("## Exemplo 1: Headers de Autenticação");

try {
    var response = Nexus.http.request({
        method: "GET",
        url: "https://httpbin.org/headers",
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
            "X-API-Key": "sk-nexus-12345",
            "X-Request-ID": "req-" + Date.now()
        }
    });

    if (response.status === 200) {
        var data = JSON.parse(response.body);
        Nexus.tui.success("Headers enviados com sucesso!");

        // httpbin retorna os headers recebidos
        var headers = data.headers;
        var rows = [];
        for (var key in headers) {
            if (key.indexOf("X-") === 0 || key === "Authorization") {
                rows.push([key, headers[key].substring(0, 50)]);
            }
        }
        Nexus.tui.table(["Header", "Valor"], rows);
    }
} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 2: Content-Type Customizado");

try {
    var xmlData = '<?xml version="1.0"?><user><name>Test</name></user>';

    var resp = Nexus.http.request({
        method: "POST",
        url: "https://httpbin.org/post",
        headers: {
            "Content-Type": "application/xml",
            "Accept": "application/json"
        },
        body: xmlData
    });

    if (resp.status === 200) {
        Nexus.tui.success("XML enviado com Content-Type correto!");
        var result = JSON.parse(resp.body);
        Nexus.tui.info("Content-Type recebido: " + result.headers["Content-Type"]);
    }
} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 3: PUT Request");

try {
    var updateData = {
        id: 1,
        name: "Nome Atualizado",
        updatedAt: new Date().toISOString()
    };

    var resp = Nexus.http.request({
        method: "PUT",
        url: "https://httpbin.org/put",
        headers: {
            "Content-Type": "application/json",
            "X-Updated-By": "nexus-script"
        },
        body: JSON.stringify(updateData)
    });

    if (resp.status === 200) {
        Nexus.tui.success("PUT realizado com sucesso!");
        Nexus.tui.info("Método HTTP usado: PUT");
    }
} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 4: DELETE Request");

try {
    var resp = Nexus.http.request({
        method: "DELETE",
        url: "https://httpbin.org/delete",
        headers: {
            "X-Resource-ID": "12345"
        }
    });

    if (resp.status === 200) {
        Nexus.tui.success("DELETE realizado com sucesso!");
    }
} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.box("✅ Exemplos de Headers concluídos!");
