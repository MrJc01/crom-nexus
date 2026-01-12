// =====================================================
// 10_http_timeout_retry.js - Timeout e Retry
// Demonstra: Configuração de timeout e retry automático
// =====================================================

Nexus.tui.title("HTTP Timeout e Retry");

Nexus.tui.markdown("## Configurações Padrão");
Nexus.tui.table(
    ["Configuração", "Valor Padrão"],
    [
        ["Timeout", "30 segundos"],
        ["Retries", "3 tentativas"]
    ]
);

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 1: Configurar Timeout");

// Configurar timeout para 10 segundos
Nexus.http.setTimeout(10000);
Nexus.tui.success("Timeout configurado para 10 segundos");

try {
    // Use delay endpoint do httpbin para testar (mas com delay menor que timeout)
    Nexus.tui.info("Fazendo requisição com delay de 2s...");
    var start = Date.now();

    var resp = Nexus.http.get("https://httpbin.org/delay/2");

    var elapsed = Date.now() - start;
    Nexus.tui.success("Resposta recebida em " + elapsed + "ms");
} catch (e) {
    Nexus.tui.error("Timeout ou erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 2: Configurar Retry");

// Configurar número de tentativas
Nexus.http.setRetries(5);
Nexus.tui.success("Retries configurado para 5 tentativas");

Nexus.tui.info("O retry é automático em caso de falha de conexão.");
Nexus.tui.info("Cada tentativa tem delay incremental (500ms, 1s, 1.5s, ...)");

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 3: Timeout por Requisição");

try {
    var resp = Nexus.http.request({
        method: "GET",
        url: "https://httpbin.org/delay/1",
        timeout: 5000,  // 5 segundos só para esta requisição
        headers: {
            "X-Custom": "Timeout Test"
        }
    });

    Nexus.tui.success("Requisição com timeout customizado: OK");
} catch (e) {
    Nexus.tui.error("Falhou: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 4: Tratando Erros de Rede");

Nexus.tui.info("Tratamento de diferentes cenários de erro:");

// Teste 1: Servidor lento (mas dentro do timeout)
try {
    Nexus.tui.print("→ Servidor lento (OK)...", "info");
    Nexus.http.setTimeout(15000);
    Nexus.http.get("https://httpbin.org/delay/1");
    Nexus.tui.success("  Resposta OK");
} catch (e) {
    Nexus.tui.error("  Falhou: " + e);
}

// Teste 2: Status 500
try {
    Nexus.tui.print("→ Erro 500...", "info");
    var err500 = Nexus.http.get("https://httpbin.org/status/500");
    Nexus.tui.warn("  Status recebido: " + err500.status);
} catch (e) {
    Nexus.tui.error("  Exception: " + e);
}

// Teste 3: Status 404
try {
    Nexus.tui.print("→ Erro 404...", "info");
    var err404 = Nexus.http.get("https://httpbin.org/status/404");
    Nexus.tui.warn("  Status recebido: " + err404.status);
} catch (e) {
    Nexus.tui.error("  Exception: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.box("✅ Demonstração de Timeout e Retry concluída!\n\nDicas:\n- Use setTimeout para operações lentas\n- setRetries ajuda em redes instáveis\n- Timeout pode ser por-requisição");
