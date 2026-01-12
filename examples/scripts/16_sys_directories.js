// =====================================================
// 16_sys_directories.js - Manipulação de Diretórios
// Demonstra: mkdir, listDir, env, open, download
// =====================================================

Nexus.tui.title("Sistema - Diretórios e Utilitários");

Nexus.tui.markdown("## Exemplo 1: Criar Diretório");

try {
    var created = Nexus.sys.mkdir("meus_dados");
    Nexus.tui.print("mkdir('meus_dados'): " + (created ? "Criado ✓" : "Já existe"), created ? "success" : "info");

    // Criar subdiretório
    var subCreated = Nexus.sys.mkdir("meus_dados/backup");
    Nexus.tui.print("mkdir('meus_dados/backup'): " + (subCreated ? "Criado ✓" : "Já existe"), subCreated ? "success" : "info");

} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 2: Listar Diretório");

// Criar alguns arquivos para listar
Nexus.sys.save("meus_dados/arquivo1.txt", "Conteúdo 1");
Nexus.sys.save("meus_dados/arquivo2.txt", "Conteúdo 2");
Nexus.sys.save("meus_dados/config.json", '{"test": true}');

try {
    var files = Nexus.sys.listDir("meus_dados");

    Nexus.tui.success("Conteúdo de 'meus_dados/':");

    var rows = [];
    for (var i = 0; i < files.length; i++) {
        var f = files[i];
        rows.push([
            f.name,
            f.isDir ? "📁 Diretório" : "📄 Arquivo",
            f.isDir ? "-" : f.size + " bytes"
        ]);
    }

    Nexus.tui.table(["Nome", "Tipo", "Tamanho"], rows);

} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 3: Listar Diretório Raiz (sandbox)");

try {
    // Listar diretório raiz do sandbox (~/.nexus/)
    var root = Nexus.sys.listDir(".");

    Nexus.tui.info("Arquivos no diretório raiz (~/.nexus/):");

    var items = [];
    for (var i = 0; i < root.length && i < 10; i++) {  // Limitar a 10 itens
        var item = root[i];
        items.push([
            item.name,
            item.isDir ? "DIR" : item.size + "B"
        ]);
    }

    if (items.length > 0) {
        Nexus.tui.table(["Nome", "Info"], items);
    }

    if (root.length > 10) {
        Nexus.tui.info("... e mais " + (root.length - 10) + " itens");
    }

} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 4: Variáveis de Ambiente");

// Ler variáveis de ambiente do sistema
var envVars = ["HOME", "USER", "SHELL", "PATH", "LANG"];

var envRows = [];
for (var i = 0; i < envVars.length; i++) {
    var name = envVars[i];
    var value = Nexus.sys.env(name);

    // Truncar valores longos
    if (value && value.length > 40) {
        value = value.substring(0, 40) + "...";
    }

    envRows.push([name, value || "(não definida)"]);
}

Nexus.tui.table(["Variável", "Valor"], envRows);

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 5: Acessar por Variável de Ambiente");

try {
    var home = Nexus.sys.env("HOME");
    var user = Nexus.sys.env("USER");

    Nexus.tui.info("Olá, " + user + "!");
    Nexus.tui.info("Seu diretório home é: " + home);

} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 6: Abrir URL no Navegador");

Nexus.tui.info("A função Nexus.sys.open() abre URLs no navegador padrão.");
Nexus.tui.warn("Descomentando a linha abaixo abriria o GitHub:");
Nexus.tui.print("// Nexus.sys.open(\"https://github.com/MrJc01/crom-nexus\")");

// Descomente para testar:
// Nexus.sys.open("https://github.com/MrJc01/crom-nexus");

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 7: Download de Arquivo");

Nexus.tui.info("A função Nexus.sys.download() baixa arquivos.");
Nexus.tui.info("Arquivos são salvos em ~/.nexus/downloads/");

// Exemplo (pode demorar - descomente para testar):
/*
try {
    Nexus.tui.info("Baixando arquivo de exemplo...");
    var success = Nexus.sys.download(
        "https://httpbin.org/image/png",
        "example_image.png"
    );
    
    if (success) {
        Nexus.tui.success("Download concluído: downloads/example_image.png");
    } else {
        Nexus.tui.error("Falha no download");
    }
} catch (e) {
    Nexus.tui.error("Erro: " + e);
}
*/

Nexus.tui.box("✅ Utilitários de sistema demonstrados!\n\nFunções:\n• mkdir(nome) → boolean\n• listDir(dir) → [{name, isDir, size}]\n• env(nome) → string\n• open(url) → abre no navegador\n• download(url, nome) → boolean");
