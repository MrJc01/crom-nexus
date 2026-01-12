// =====================================================
// 05_tables.js - Tabelas Formatadas
// Demonstra: Nexus.tui.table com diferentes layouts
// =====================================================

Nexus.tui.title("Tabelas Formatadas");

// Tabela simples
Nexus.tui.markdown("## Tabela Simples");
Nexus.tui.table(
    ["Nome", "Idade"],
    [
        ["Alice", "28"],
        ["Bob", "34"],
        ["Carol", "25"]
    ]
);

Nexus.tui.markdown("---");

// Tabela com mais colunas
Nexus.tui.markdown("## Tabela de Produtos");
Nexus.tui.table(
    ["Código", "Produto", "Preço", "Estoque"],
    [
        ["001", "Laptop Pro", "R$ 5.999,00", "15"],
        ["002", "Mouse Wireless", "R$ 149,90", "200"],
        ["003", "Teclado Mecânico", "R$ 399,00", "45"],
        ["004", "Monitor 27\"", "R$ 1.899,00", "30"],
        ["005", "Webcam HD", "R$ 299,90", "80"]
    ]
);

Nexus.tui.markdown("---");

// Tabela dinâmica (gerada por código)
Nexus.tui.markdown("## Tabela Dinâmica");

var servers = [
    { name: "web-01", cpu: 45, mem: 68, status: "OK" },
    { name: "db-01", cpu: 78, mem: 82, status: "Alerta" },
    { name: "cache-01", cpu: 12, mem: 35, status: "OK" },
    { name: "api-01", cpu: 55, mem: 61, status: "OK" }
];

var rows = [];
for (var i = 0; i < servers.length; i++) {
    var s = servers[i];
    rows.push([
        s.name,
        s.cpu + "%",
        s.mem + "%",
        s.status
    ]);
}

Nexus.tui.table(["Servidor", "CPU", "Memória", "Status"], rows);

Nexus.tui.markdown("---");

// Tabela de métricas
Nexus.tui.markdown("## Relatório de Métricas");
Nexus.tui.table(
    ["Métrica", "Valor", "Tendência"],
    [
        ["Usuários Ativos", "1,234", "↑ +12%"],
        ["Tempo de Resposta", "45ms", "↓ -5%"],
        ["Taxa de Erro", "0.2%", "→ estável"],
        ["Uptime", "99.9%", "↑ +0.1%"],
        ["Requisições/min", "8,450", "↑ +23%"]
    ]
);

Nexus.tui.box("✅ Todas as tabelas renderizadas com sucesso!");
