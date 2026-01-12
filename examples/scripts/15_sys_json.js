// =====================================================
// 15_sys_json.js - Persistência de Objetos JSON
// Demonstra: Salvar e carregar objetos JavaScript
// =====================================================

Nexus.tui.title("Persistência de JSON");

Nexus.tui.markdown("## Por que usar JSON?");
Nexus.tui.info("JSON permite salvar objetos complexos (arrays, objetos aninhados)");
Nexus.tui.info("Ideal para configurações, cache, e dados estruturados");

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 1: Salvar Objeto Simples");

var config = {
    appName: "Minha App",
    version: "1.0.0",
    debug: true,
    port: 8080
};

try {
    // JSON.stringify converte objeto para string
    var jsonString = JSON.stringify(config, null, 2);  // null, 2 = formatado
    Nexus.sys.save("app_config.json", jsonString);

    Nexus.tui.success("Configuração salva!");
    Nexus.tui.print(jsonString);
} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 2: Carregar e Usar Objeto");

try {
    var loaded = Nexus.sys.load("app_config.json");

    if (loaded) {
        // JSON.parse converte string para objeto
        var configObj = JSON.parse(loaded);

        Nexus.tui.success("Configuração carregada!");
        Nexus.tui.table(
            ["Chave", "Valor", "Tipo"],
            [
                ["appName", configObj.appName, typeof configObj.appName],
                ["version", configObj.version, typeof configObj.version],
                ["debug", configObj.debug.toString(), typeof configObj.debug],
                ["port", configObj.port.toString(), typeof configObj.port]
            ]
        );
    }
} catch (e) {
    Nexus.tui.error("Erro ao carregar: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 3: Array de Objetos");

var tasks = [
    { id: 1, title: "Comprar leite", done: true },
    { id: 2, title: "Estudar Nexus", done: false },
    { id: 3, title: "Fazer exercício", done: false },
    { id: 4, title: "Ler documentação", done: true }
];

try {
    Nexus.sys.save("tasks.json", JSON.stringify(tasks, null, 2));
    Nexus.tui.success("Lista de tarefas salva!");

    // Carregar e exibir
    var loadedTasks = JSON.parse(Nexus.sys.load("tasks.json"));

    var rows = [];
    for (var i = 0; i < loadedTasks.length; i++) {
        var t = loadedTasks[i];
        rows.push([
            t.id.toString(),
            t.title,
            t.done ? "✓ Feito" : "○ Pendente"
        ]);
    }

    Nexus.tui.table(["ID", "Tarefa", "Status"], rows);
} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 4: Objeto Aninhado Complexo");

var userData = {
    user: {
        id: 12345,
        name: "João Silva",
        email: "joao@email.com"
    },
    preferences: {
        theme: "dark",
        language: "pt-BR",
        notifications: {
            email: true,
            push: false,
            sms: false
        }
    },
    history: [
        { action: "login", timestamp: "2024-01-01T10:00:00Z" },
        { action: "update_profile", timestamp: "2024-01-02T15:30:00Z" }
    ]
};

try {
    Nexus.sys.save("user_data.json", JSON.stringify(userData, null, 2));

    // Carregar e acessar dados aninhados
    var data = JSON.parse(Nexus.sys.load("user_data.json"));

    Nexus.tui.success("Dados do usuário:");
    Nexus.tui.print("Nome: " + data.user.name, "info");
    Nexus.tui.print("Tema: " + data.preferences.theme, "info");
    Nexus.tui.print("Notificações por email: " + data.preferences.notifications.email, "info");
    Nexus.tui.print("Último evento: " + data.history[data.history.length - 1].action, "info");

} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 5: Atualizar JSON Existente");

try {
    // Carregar configuração existente
    var conf = JSON.parse(Nexus.sys.load("app_config.json"));

    // Modificar
    conf.version = "1.1.0";
    conf.lastUpdate = new Date().toISOString();
    conf.newFeature = true;

    // Salvar novamente
    Nexus.sys.save("app_config.json", JSON.stringify(conf, null, 2));

    Nexus.tui.success("Configuração atualizada para v" + conf.version);

} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.box("✅ Persistência JSON demonstrada!\n\nPadrão:\n1. JSON.stringify(obj) → string\n2. Nexus.sys.save(nome, string)\n3. Nexus.sys.load(nome) → string\n4. JSON.parse(string) → obj");
