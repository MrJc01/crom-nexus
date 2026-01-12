// =====================================================
// 03_styled_output.js - Mensagens Estilizadas
// Demonstra: success, error, info, warn, title, header
// =====================================================

Nexus.tui.title("Mensagens Estilizadas");

Nexus.tui.markdown("## Funções de Mensagem com Ícones");

// Cada função adiciona um ícone e cor apropriada
Nexus.tui.success("Operação concluída com sucesso!");
Nexus.tui.error("Falha ao processar requisição!");
Nexus.tui.info("Informação importante sobre o sistema");
Nexus.tui.warn("Atenção: recurso será descontinuado");

Nexus.tui.markdown("---");

// Header cria um cabeçalho com linha divisória
Nexus.tui.header("Seção do Relatório");
Nexus.tui.print("Conteúdo da seção aqui...");

Nexus.tui.header("Outra Seção");
Nexus.tui.print("Mais conteúdo...");

Nexus.tui.markdown("---");

// Title é para o título principal do script
Nexus.tui.markdown("## Diferença entre Title e Header");

Nexus.tui.info("title() - Título principal com emoji 🚀");
Nexus.tui.info("header() - Cabeçalho de seção com linha divisória");
Nexus.tui.info("success() - Mensagem de sucesso com ✓");
Nexus.tui.info("error() - Mensagem de erro com ✗");
Nexus.tui.info("info() - Informação com ℹ");
Nexus.tui.info("warn() - Aviso com ⚠");

Nexus.tui.box("✅ Todas as funções de mensagem demonstradas!");
