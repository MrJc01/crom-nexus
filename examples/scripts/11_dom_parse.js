// =====================================================
// 11_dom_parse.js - Parsing Básico de HTML
// Demonstra: Nexus.dom.parse para criar documento
// =====================================================

Nexus.tui.title("DOM Parser - Básico");

Nexus.tui.markdown("## O que é o DOM Parser?");
Nexus.tui.info("O Nexus.dom permite parsear HTML e extrair dados usando seletores CSS.");
Nexus.tui.info("É baseado no goquery (similar ao jQuery para Go).");

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 1: Parse de HTML String");

var html = `
<!DOCTYPE html>
<html>
<head><title>Minha Página</title></head>
<body>
    <h1 id="titulo">Bem-vindo ao Nexus!</h1>
    <p class="descricao">Este é um exemplo de parsing HTML.</p>
    <div class="container">
        <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </ul>
    </div>
</body>
</html>
`;

try {
    // Parse cria um documento que pode ser consultado
    var doc = Nexus.dom.parse(html);
    Nexus.tui.success("HTML parseado com sucesso!");
} catch (e) {
    Nexus.tui.error("Erro no parse: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 2: Selecionar Elementos");

try {
    var doc = Nexus.dom.parse(html);

    // Selecionar por tag
    var h1 = doc.select("h1");
    Nexus.tui.print("Encontrado: " + h1.length + " elemento(s) h1", "info");

    // Selecionar por classe
    var desc = doc.select(".descricao");
    Nexus.tui.print("Encontrado: " + desc.length + " elemento(s) .descricao", "info");

    // Selecionar por ID
    var titulo = doc.select("#titulo");
    Nexus.tui.print("Encontrado: " + titulo.length + " elemento(s) #titulo", "info");

    // Selecionar múltiplos
    var items = doc.select("li");
    Nexus.tui.print("Encontrado: " + items.length + " elemento(s) li", "info");

} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 3: Extrair Texto");

try {
    var doc = Nexus.dom.parse(html);

    var titulo = doc.select("h1");
    if (titulo.length > 0) {
        // .text() extrai o texto do elemento
        Nexus.tui.success("Título: " + titulo[0].text());
    }

    var paragrafo = doc.select(".descricao");
    if (paragrafo.length > 0) {
        Nexus.tui.success("Descrição: " + paragrafo[0].text());
    }

    // Extrair texto de múltiplos elementos
    var items = doc.select("li");
    var textos = [];
    for (var i = 0; i < items.length; i++) {
        textos.push(items[i].text());
    }
    Nexus.tui.success("Itens: " + textos.join(", "));

} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Exemplo 4: HTML Interno");

try {
    var doc = Nexus.dom.parse(html);

    var container = doc.select(".container");
    if (container.length > 0) {
        // .html() retorna o HTML interno do elemento
        var innerHtml = container[0].html();
        Nexus.tui.info("HTML interno do .container:");
        Nexus.tui.print(innerHtml.trim());
    }
} catch (e) {
    Nexus.tui.error("Erro: " + e);
}

Nexus.tui.box("✅ Parsing básico de DOM concluído!\n\nMétodos disponíveis:\n• doc.select(seletor) - Retorna array\n• elemento.text() - Texto do elemento\n• elemento.html() - HTML interno\n• elemento.attr(nome) - Valor do atributo");
