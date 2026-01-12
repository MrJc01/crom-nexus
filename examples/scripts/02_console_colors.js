// =====================================================
// 02_console_colors.js - Cores no Terminal
// Demonstra: Nexus.tui.print com diferentes cores
// =====================================================

Nexus.tui.title("Demonstração de Cores");

Nexus.tui.markdown("## Cores Básicas");

// O segundo parâmetro define a cor do texto
Nexus.tui.print("Texto sem cor (padrão)");
Nexus.tui.print("Texto VERDE - success", "green");
Nexus.tui.print("Texto VERMELHO - error", "red");
Nexus.tui.print("Texto AZUL - info", "blue");
Nexus.tui.print("Texto AMARELO - warning", "yellow");
Nexus.tui.print("Texto ROXO - title", "purple");

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Aliases de Cor");

// Você pode usar aliases semânticos
Nexus.tui.print("Alias: success (verde)", "success");
Nexus.tui.print("Alias: error (vermelho)", "error");
Nexus.tui.print("Alias: info (azul)", "info");
Nexus.tui.print("Alias: warn (amarelo)", "warn");
Nexus.tui.print("Alias: title (roxo)", "title");

Nexus.tui.markdown("---");

// Exemplo prático: Log de status
Nexus.tui.markdown("## Exemplo Prático: Log de Status");

var logs = [
    { msg: "Iniciando aplicação...", type: "info" },
    { msg: "Conectando ao banco de dados...", type: "info" },
    { msg: "Conexão estabelecida!", type: "success" },
    { msg: "Cache expirado, recarregando...", type: "warn" },
    { msg: "Falha ao carregar módulo opcional", type: "error" },
    { msg: "Sistema pronto!", type: "success" }
];

for (var i = 0; i < logs.length; i++) {
    Nexus.tui.print("[" + new Date().toISOString().substring(11, 19) + "] " + logs[i].msg, logs[i].type);
}

Nexus.tui.box("✅ Demonstração de cores concluída");
