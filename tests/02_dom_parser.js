// =====================================================
// 02_dom_parser.js - DOM Parsing Module Test
// Tests: Nexus.dom.parse, select, text, attr, html
// =====================================================

Nexus.tui.title("DOM Parser Test (Nexus.dom)");

var passed = 0;
var failed = 0;

// =====================================================
// Sample HTML for testing
// =====================================================
var testHTML = `
<!DOCTYPE html>
<html>
<head><title>Test Page</title></head>
<body>
    <div id="main" class="container">
        <h1 class="title">Welcome to Nexus</h1>
        <p class="description">This is a test paragraph.</p>
        <ul id="links">
            <li><a href="https://google.com" class="link">Google</a></li>
            <li><a href="https://github.com" class="link">GitHub</a></li>
            <li><a href="https://example.com" class="link">Example</a></li>
        </ul>
        <div class="product" data-price="99.99">
            <span class="name">Product A</span>
        </div>
        <div class="product" data-price="149.99">
            <span class="name">Product B</span>
        </div>
    </div>
</body>
</html>
`;

// =====================================================
// TEST 1: Parse HTML
// =====================================================
Nexus.tui.info("Test 1: Parsing HTML string");

var doc;
try {
    doc = Nexus.dom.parse(testHTML);
    Nexus.tui.success("HTML parsed successfully");
    passed++;
} catch (e) {
    Nexus.tui.error("Failed to parse HTML: " + e);
    failed++;
}

// =====================================================
// TEST 2: Select by class and extract text
// =====================================================
Nexus.tui.info("Test 2: Select by class (.title)");

try {
    var titles = doc.select(".title");
    if (titles.length > 0) {
        var titleText = titles[0].text();
        if (titleText === "Welcome to Nexus") {
            Nexus.tui.success("Extracted correct title: '" + titleText + "'");
            passed++;
        } else {
            Nexus.tui.error("Wrong title text: " + titleText);
            failed++;
        }
    } else {
        Nexus.tui.error("No elements found with .title");
        failed++;
    }
} catch (e) {
    Nexus.tui.error("Select failed: " + e);
    failed++;
}

// =====================================================
// TEST 3: Select multiple elements
// =====================================================
Nexus.tui.info("Test 3: Select multiple elements (.link)");

try {
    var links = doc.select(".link");
    if (links.length === 3) {
        Nexus.tui.success("Found " + links.length + " links (expected 3)");
        passed++;
    } else {
        Nexus.tui.error("Wrong link count: " + links.length);
        failed++;
    }
} catch (e) {
    Nexus.tui.error("Multiple select failed: " + e);
    failed++;
}

// =====================================================
// TEST 4: Extract attribute (href)
// =====================================================
Nexus.tui.info("Test 4: Extract href attribute");

try {
    var firstLink = doc.select(".link")[0];
    var href = firstLink.attr("href");
    if (href === "https://google.com") {
        Nexus.tui.success("Extracted href: " + href);
        passed++;
    } else {
        Nexus.tui.error("Wrong href: " + href);
        failed++;
    }
} catch (e) {
    Nexus.tui.error("Attr extraction failed: " + e);
    failed++;
}

// =====================================================
// TEST 5: Extract data attribute
// =====================================================
Nexus.tui.info("Test 5: Extract data-price attribute");

try {
    var products = doc.select(".product");
    var price = products[0].attr("data-price");
    if (price === "99.99") {
        Nexus.tui.success("Extracted data-price: " + price);
        passed++;
    } else {
        Nexus.tui.error("Wrong data-price: " + price);
        failed++;
    }
} catch (e) {
    Nexus.tui.error("Data attr extraction failed: " + e);
    failed++;
}

// =====================================================
// TEST 6: Select by ID
// =====================================================
Nexus.tui.info("Test 6: Select by ID (#main)");

try {
    var main = doc.select("#main");
    if (main.length === 1) {
        Nexus.tui.success("Found #main container");
        passed++;
    } else {
        Nexus.tui.error("ID selector returned wrong count: " + main.length);
        failed++;
    }
} catch (e) {
    Nexus.tui.error("ID select failed: " + e);
    failed++;
}

// =====================================================
// SUMMARY
// =====================================================
Nexus.tui.markdown("---");
Nexus.tui.markdown("## Results");

var total = passed + failed;
Nexus.tui.table(
    ["Metric", "Value"],
    [
        ["Total Tests", total.toString()],
        ["Passed", passed.toString()],
        ["Failed", failed.toString()]
    ]
);

if (failed === 0) {
    Nexus.tui.box("✅ ALL DOM TESTS PASSED");
} else {
    Nexus.tui.print("❌ SOME TESTS FAILED", "error");
}
