// =====================================================
// 14_sys_save_load.js - Salvar e Carregar Arquivos
// Demonstra: Nexus.sys.save, load, exists, remove
// =====================================================

Nexus.tui.title("Sistema de Arquivos - Básico");

Nexus.tui.markdown("## Importante!");
Nexus.tui.info("Todos os arquivos são salvos em ~/.nexus/ (sandbox)");
Nexus.tui.info("Isso garante segurança e isolamento dos scripts.");

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 1: Salvar Arquivo de Texto");

var content = "Olá, Nexus!\n";
content += "Este é um arquivo de teste.\n";
content += "Criado em: " + new Date().toISOString() + "\n";

try {
    Nexus.sys.save("teste.txt", content);
    Nexus.tui.success("Arquivo salvo: teste.txt");
} catch (e) {
    Nexus.tui.error("Erro ao salvar: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 2: Carregar Arquivo");

try {
    var loaded = Nexus.sys.load("teste.txt");

    if (loaded !== null) {
        Nexus.tui.success("Arquivo carregado com sucesso!");
        Nexus.tui.box(loaded);
    } else {
        Nexus.tui.error("Arquivo não encontrado");
    }
} catch (e) {
    Nexus.tui.error("Erro ao carregar: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 3: Verificar se Arquivo Existe");

// Arquivo que existe
var exists1 = Nexus.sys.exists("teste.txt");
Nexus.tui.print("teste.txt existe? " + (exists1 ? "SIM ✓" : "NÃO ✗"), exists1 ? "success" : "error");

// Arquivo que não existe
var exists2 = Nexus.sys.exists("arquivo_inexistente.xyz");
Nexus.tui.print("arquivo_inexistente.xyz existe? " + (exists2 ? "SIM ✓" : "NÃO ✗"), exists2 ? "success" : "error");

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 4: Sobrescrever Arquivo");

try {
    var novoConteudo = "Este conteúdo foi SOBRESCRITO!\nNova data: " + new Date().toISOString();
    Nexus.sys.save("teste.txt", novoConteudo);
    Nexus.tui.success("Arquivo sobrescrito!");

    var verificar = Nexus.sys.load("teste.txt");
    Nexus.tui.info("Novo conteúdo:");
    Nexus.tui.print(verificar);
} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 5: Remover Arquivo");

try {
    // Criar arquivo temporário
    Nexus.sys.save("temp_para_deletar.txt", "Este arquivo será deletado");
    Nexus.tui.info("Arquivo temporário criado");

    // Verificar que existe
    var existeAntes = Nexus.sys.exists("temp_para_deletar.txt");
    Nexus.tui.print("Existe antes de deletar: " + existeAntes, "info");

    // Remover
    var removed = Nexus.sys.remove("temp_para_deletar.txt");
    Nexus.tui.print("Comando remove retornou: " + removed, "info");

    // Verificar que foi removido
    var existeDepois = Nexus.sys.exists("temp_para_deletar.txt");
    Nexus.tui.print("Existe depois de deletar: " + existeDepois, existeDepois ? "error" : "success");

} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 6: Múltiplos Arquivos");

var arquivos = [
    { nome: "config.txt", conteudo: "debug=true\nport=8080" },
    { nome: "users.txt", conteudo: "admin\njohn\njane" },
    { nome: "log.txt", conteudo: "[INFO] Sistema iniciado" }
];

for (var i = 0; i < arquivos.length; i++) {
    try {
        Nexus.sys.save(arquivos[i].nome, arquivos[i].conteudo);
        Nexus.tui.success("Criado: " + arquivos[i].nome);
    } catch (e) {
        Nexus.tui.error("Erro em " + arquivos[i].nome + ": " + e);
    }
}

Nexus.tui.box("✅ Operações de arquivo demonstradas!\n\nFunções:\n• save(nome, conteudo)\n• load(nome) → string ou null\n• exists(nome) → boolean\n• remove(nome) → boolean");
