// =====================================================
// 12_dom_selectors.js - Seletores CSS Avançados
// Demonstra: Diferentes tipos de seletores CSS
// =====================================================

Nexus.tui.title("DOM Parser - Seletores Avançados");

var html = `
<div class="products-container">
    <div id="product-1" class="product featured" data-price="99.90" data-category="electronics">
        <h3 class="product-name">Laptop Pro</h3>
        <span class="price">R$ 99,90</span>
        <a href="/products/laptop" class="btn-buy">Comprar</a>
    </div>
    
    <div id="product-2" class="product" data-price="49.90" data-category="accessories">
        <h3 class="product-name">Mouse Wireless</h3>
        <span class="price">R$ 49,90</span>
        <a href="/products/mouse" class="btn-buy">Comprar</a>
    </div>
    
    <div id="product-3" class="product featured" data-price="149.90" data-category="electronics">
        <h3 class="product-name">Teclado RGB</h3>
        <span class="price">R$ 149,90</span>
        <a href="/products/keyboard" class="btn-buy">Comprar</a>
    </div>
    
    <div class="sidebar">
        <ul class="categories">
            <li><a href="/cat/electronics">Eletrônicos</a></li>
            <li><a href="/cat/accessories">Acessórios</a></li>
            <li><a href="/cat/home">Casa</a></li>
        </ul>
    </div>
</div>
`;

var doc = Nexus.dom.parse(html);

Nexus.tui.markdown("## Seletores Básicos");

// Por ID
var byId = doc.select("#product-1");
Nexus.tui.print("ID #product-1: " + byId.length + " elemento", "info");

// Por classe
var byClass = doc.select(".product");
Nexus.tui.print("Classe .product: " + byClass.length + " elementos", "info");

// Por tag
var byTag = doc.select("h3");
Nexus.tui.print("Tag h3: " + byTag.length + " elementos", "info");

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Seletores Compostos");

// Múltiplas classes
var featured = doc.select(".product.featured");
Nexus.tui.print(".product.featured: " + featured.length + " elementos", "info");

// Tag + classe
var h3Name = doc.select("h3.product-name");
Nexus.tui.print("h3.product-name: " + h3Name.length + " elementos", "info");

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Seletores Hierárquicos");

// Descendente (espaço)
var productLinks = doc.select(".product a");
Nexus.tui.print(".product a (descendente): " + productLinks.length + " elementos", "info");

// Filho direto (>)
var directLinks = doc.select(".categories > li");
Nexus.tui.print(".categories > li (filho direto): " + directLinks.length + " elementos", "info");

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Seletores de Atributo");

// Atributo existe
var withData = doc.select("[data-price]");
Nexus.tui.print("[data-price]: " + withData.length + " elementos", "info");

// Atributo com valor específico
var electronics = doc.select('[data-category="electronics"]');
Nexus.tui.print('[data-category="electronics"]: ' + electronics.length + " elementos", "info");

// Atributo começa com
var linksWithRef = doc.select('[href^="/products"]');
Nexus.tui.print('[href^="/products"]: ' + linksWithRef.length + " elementos", "info");

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Extraindo Atributos");

Nexus.tui.info("Produtos encontrados:");

var products = doc.select(".product");
var rows = [];
for (var i = 0; i < products.length; i++) {
    var p = products[i];
    rows.push([
        p.attr("id"),
        p.attr("data-category"),
        "R$ " + p.attr("data-price")
    ]);
}

Nexus.tui.table(["ID", "Categoria", "Preço"], rows);

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Links Extraídos");

var allLinks = doc.select("a");
var linkRows = [];
for (var i = 0; i < allLinks.length; i++) {
    var link = allLinks[i];
    linkRows.push([
        link.text(),
        link.attr("href")
    ]);
}

Nexus.tui.table(["Texto", "URL"], linkRows);

Nexus.tui.box("✅ Seletores CSS demonstrados!\n\nSeletores suportados:\n• #id, .classe, tag\n• .classe1.classe2\n• pai filho, pai > filho\n• [attr], [attr=\"value\"]\n• [attr^=\"prefix\"], [attr$=\"suffix\"]");
