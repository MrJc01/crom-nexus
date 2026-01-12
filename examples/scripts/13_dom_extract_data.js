// =====================================================
// 13_dom_extract_data.js - Extração de Dados
// Demonstra: Web scraping e estruturação de dados
// =====================================================

Nexus.tui.title("DOM Parser - Extração de Dados");

Nexus.tui.markdown("## Cenário: Extrair dados de uma página de produtos");

// HTML simulando uma página de e-commerce
var html = `
<div class="product-listing">
    <article class="product-card" data-sku="SKU001">
        <img src="/img/laptop.jpg" alt="Laptop Pro 15" class="product-img">
        <h2 class="product-title"><a href="/p/laptop-pro">Laptop Pro 15"</a></h2>
        <div class="product-info">
            <span class="brand">TechBrand</span>
            <span class="rating" data-score="4.5">★★★★½</span>
            <span class="reviews">(127 avaliações)</span>
        </div>
        <div class="pricing">
            <span class="price-original">R$ 6.999,00</span>
            <span class="price-current">R$ 5.499,00</span>
            <span class="discount">-21%</span>
        </div>
        <ul class="features">
            <li>Intel Core i7</li>
            <li>16GB RAM</li>
            <li>512GB SSD</li>
        </ul>
    </article>
    
    <article class="product-card" data-sku="SKU002">
        <img src="/img/phone.jpg" alt="Smartphone X" class="product-img">
        <h2 class="product-title"><a href="/p/smartphone-x">Smartphone X Pro</a></h2>
        <div class="product-info">
            <span class="brand">PhoneCorp</span>
            <span class="rating" data-score="4.8">★★★★★</span>
            <span class="reviews">(543 avaliações)</span>
        </div>
        <div class="pricing">
            <span class="price-original">R$ 4.599,00</span>
            <span class="price-current">R$ 3.999,00</span>
            <span class="discount">-13%</span>
        </div>
        <ul class="features">
            <li>6.7" AMOLED</li>
            <li>256GB</li>
            <li>5G</li>
        </ul>
    </article>
    
    <article class="product-card" data-sku="SKU003">
        <img src="/img/tablet.jpg" alt="Tablet Air" class="product-img">
        <h2 class="product-title"><a href="/p/tablet-air">Tablet Air 11"</a></h2>
        <div class="product-info">
            <span class="brand">TechBrand</span>
            <span class="rating" data-score="4.3">★★★★☆</span>
            <span class="reviews">(89 avaliações)</span>
        </div>
        <div class="pricing">
            <span class="price-original">R$ 3.299,00</span>
            <span class="price-current">R$ 2.799,00</span>
            <span class="discount">-15%</span>
        </div>
        <ul class="features">
            <li>M1 Chip</li>
            <li>8GB RAM</li>
            <li>WiFi 6</li>
        </ul>
    </article>
</div>
`;

var doc = Nexus.dom.parse(html);

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Passo 1: Identificar produtos");

var cards = doc.select(".product-card");
Nexus.tui.success("Encontrados " + cards.length + " produtos");

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Passo 2: Extrair dados estruturados");

var products = [];

// Para cada produto, extraímos os dados
for (var i = 0; i < cards.length; i++) {
    // Nota: Como não temos DOM verdadeiro, fazemos select geral
    // Em um cenário real, você selecionaria relativo ao card
}

// Selecionar elementos específicos
var skus = doc.select(".product-card");
var titles = doc.select(".product-title a");
var brands = doc.select(".brand");
var ratings = doc.select(".rating");
var prices = doc.select(".price-current");
var discounts = doc.select(".discount");

for (var i = 0; i < titles.length; i++) {
    products.push({
        sku: skus[i].attr("data-sku"),
        title: titles[i].text(),
        url: titles[i].attr("href"),
        brand: brands[i].text(),
        rating: ratings[i].attr("data-score"),
        price: prices[i].text(),
        discount: discounts[i].text()
    });
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Passo 3: Exibir dados extraídos");

var tableData = [];
for (var i = 0; i < products.length; i++) {
    var p = products[i];
    tableData.push([
        p.sku,
        p.title,
        p.brand,
        p.price,
        p.discount
    ]);
}

Nexus.tui.table(
    ["SKU", "Produto", "Marca", "Preço", "Desc."],
    tableData
);

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Passo 4: Exportar como JSON");

var jsonOutput = JSON.stringify(products, null, 2);
Nexus.tui.info("Dados em formato JSON:");
Nexus.tui.print(jsonOutput);

// Salvar em arquivo
try {
    Nexus.sys.save("products_extracted.json", jsonOutput);
    Nexus.tui.success("Dados salvos em ~/.nexus/products_extracted.json");
} catch (e) {
    Nexus.tui.error("Erro ao salvar: " + e);
}

Nexus.tui.markdown("---");

Nexus.tui.markdown("## Passo 5: Análise simples");

// Calcular estatísticas
var totalProducts = products.length;
var techBrandCount = 0;
var avgRating = 0;

for (var i = 0; i < products.length; i++) {
    if (products[i].brand === "TechBrand") techBrandCount++;
    avgRating += parseFloat(products[i].rating);
}
avgRating = (avgRating / totalProducts).toFixed(1);

Nexus.tui.table(
    ["Métrica", "Valor"],
    [
        ["Total de Produtos", totalProducts.toString()],
        ["Produtos TechBrand", techBrandCount.toString()],
        ["Rating Médio", avgRating + "/5"]
    ]
);

Nexus.tui.box("✅ Extração de dados concluída!\n\nEste exemplo demonstra:\n• Parse de HTML complexo\n• Extração de múltiplos campos\n• Estruturação em JSON\n• Análise básica dos dados");
