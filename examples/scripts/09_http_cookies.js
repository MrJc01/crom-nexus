// =====================================================
// 09_http_cookies.js - Persistência de Cookies
// Demonstra: CookieJar para manter sessão entre requests
// =====================================================

Nexus.tui.title("HTTP Cookies e Sessões");

Nexus.tui.markdown("## Como Funciona");
Nexus.tui.info("O Nexus mantém um CookieJar que persiste cookies entre requisições.");
Nexus.tui.info("Isso permite simular sessões de login e navegação autenticada.");

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 1: Definir Cookie");

try {
    // httpbin define um cookie quando acessamos /cookies/set
    var resp = Nexus.http.get("https://httpbin.org/cookies/set?session_id=abc123&user=nexus");

    Nexus.tui.success("Cookies definidos! Status: " + resp.status);
} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 2: Verificar Cookies Persistidos");

try {
    // Esta requisição envia automaticamente os cookies salvos
    var cookieResp = Nexus.http.get("https://httpbin.org/cookies");

    if (cookieResp.status === 200) {
        var data = JSON.parse(cookieResp.body);

        Nexus.tui.success("Cookies recuperados:");

        var cookies = data.cookies;
        var rows = [];
        for (var key in cookies) {
            rows.push([key, cookies[key]]);
        }

        if (rows.length > 0) {
            Nexus.tui.table(["Nome", "Valor"], rows);
        } else {
            Nexus.tui.warn("Nenhum cookie encontrado");
        }
    }
} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 3: Fluxo de Autenticação");

Nexus.tui.info("Simulando: Login → Área Restrita → Logout");

try {
    // Passo 1: Login (define cookie de sessão)
    Nexus.tui.print("1. Fazendo login...", "info");
    Nexus.http.get("https://httpbin.org/cookies/set?auth_token=valid-jwt-token");
    Nexus.tui.success("   Login realizado!");

    // Passo 2: Acesso à área restrita (usa o cookie)
    Nexus.tui.print("2. Acessando área restrita...", "info");
    var protectedResp = Nexus.http.get("https://httpbin.org/cookies");
    var protectedData = JSON.parse(protectedResp.body);

    if (protectedData.cookies && protectedData.cookies.auth_token) {
        Nexus.tui.success("   Acesso autorizado! Token: " + protectedData.cookies.auth_token);
    }

    // Passo 3: Fazer mais requisições (cookie persiste)
    Nexus.tui.print("3. Fazendo requisição adicional...", "info");
    Nexus.http.get("https://httpbin.org/cookies/set?last_access=" + Date.now());
    Nexus.tui.success("   Cookie de última visita salvo!");

} catch (e) {
    Nexus.tui.error("Erro no fluxo: " + e);
}

Nexus.tui.markdown("---");

// Resumo final
Nexus.tui.markdown("## Resumo de Cookies Atuais");

try {
    var finalResp = Nexus.http.get("https://httpbin.org/cookies");
    var finalData = JSON.parse(finalResp.body);

    var finalRows = [];
    for (var k in finalData.cookies) {
        finalRows.push([k, finalData.cookies[k]]);
    }

    Nexus.tui.table(["Cookie", "Valor"], finalRows);
} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.box("✅ Demonstração de Cookies concluída!\n\nO CookieJar persiste durante toda a execução do script.");
