// =====================================================
// 01_hello_world.js - Introdução ao Nexus
// Primeiro script: Hello World
// =====================================================

// O objeto Nexus é a API principal do runtime
// Nexus.tui fornece funções para output formatado no terminal

Nexus.tui.title("Bem-vindo ao Nexus!");

Nexus.tui.info("Este é seu primeiro script Nexus");
Nexus.tui.success("O runtime JavaScript está funcionando!");

// Você pode usar console.log normalmente
console.log("Console.log também funciona!");

// Exibir informações do ambiente
Nexus.tui.markdown("## Informações do Sistema");
Nexus.tui.print("Script executado com sucesso!");

Nexus.tui.box("🚀 Parabéns!\n\nVocê rodou seu primeiro script Nexus.\nExplore os outros exemplos para aprender mais.");
