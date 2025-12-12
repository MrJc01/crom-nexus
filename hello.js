// =====================================================
// hello.js - Nexus Core Test Script
// This script demonstrates all Nexus Standard Library features
// =====================================================

Nexus.tui.title("Nexus Core Test Suite");
Nexus.tui.print("Testing all modules...\n", "info");

// =====================================================
// TEST 1: HTTP Module
// =====================================================
Nexus.tui.markdown("## 1. Testing `Nexus.http`");

try {
    Nexus.tui.info("Fetching https://example.com...");
    var response = Nexus.http.get("https://example.com");
    
    if (response.status === 200) {
        Nexus.tui.success("HTTP GET successful! Status: " + response.status);
    } else {
        Nexus.tui.error("Unexpected status: " + response.status);
    }
} catch (e) {
    Nexus.tui.error("HTTP request failed: " + e);
}

// =====================================================
// TEST 2: DOM Parsing
// =====================================================
Nexus.tui.markdown("## 2. Testing `Nexus.dom`");

try {
    var html = response.body;
    var doc = Nexus.dom.parse(html);
    
    // Extract the <h1> title
    var titles = doc.select("h1");
    var pageTitle = titles.length > 0 ? titles[0].text() : "Not found";
    
    // Extract paragraphs
    var paragraphs = doc.select("p");
    var paragraphTexts = [];
    for (var i = 0; i < paragraphs.length && i < 3; i++) {
        paragraphTexts.push(paragraphs[i].text());
    }
    
    Nexus.tui.success("DOM parsing successful!");
    Nexus.tui.print("Page Title: " + pageTitle, "purple");
    
} catch (e) {
    Nexus.tui.error("DOM parsing failed: " + e);
}

// =====================================================
// TEST 3: TUI Table Rendering
// =====================================================
Nexus.tui.markdown("## 3. Testing `Nexus.tui.table`");

var tableHeaders = ["Element", "Content"];
var tableRows = [
    ["Title (h1)", pageTitle || "N/A"],
    ["Status Code", response ? response.status.toString() : "N/A"],
    ["Body Length", response ? response.body.length + " chars" : "N/A"]
];

if (paragraphTexts && paragraphTexts.length > 0) {
    tableRows.push(["First Paragraph", paragraphTexts[0].substring(0, 50) + "..."]);
}

Nexus.tui.table(tableHeaders, tableRows);

// =====================================================
// TEST 4: TUI Box and Markdown
// =====================================================
Nexus.tui.markdown("## 4. Testing `Nexus.tui.box` and Markdown");

var markdownContent = "### Extracted Content\n\n";
markdownContent += "**Page Title:** " + (pageTitle || "Unknown") + "\n\n";
markdownContent += "**Paragraphs Found:** " + (paragraphs ? paragraphs.length : 0) + "\n\n";
markdownContent += "> This content was extracted from example.com using Nexus.dom!\n";

Nexus.tui.markdown(markdownContent);

Nexus.tui.box("✨ All TUI components rendered successfully!");

// =====================================================
// TEST 5: System Module (File Write)
// =====================================================
Nexus.tui.markdown("## 5. Testing `Nexus.sys`");

try {
    var logData = {
        timestamp: new Date().toISOString(),
        test: "hello.js",
        pageTitle: pageTitle,
        httpStatus: response ? response.status : null
    };
    
    Nexus.sys.save("test_log.json", JSON.stringify(logData, null, 2));
    Nexus.tui.success("Log written to ~/.nexus/test_log.json");
    
    // Read it back
    var readBack = Nexus.sys.load("test_log.json");
    if (readBack) {
        Nexus.tui.success("Log file read back successfully!");
    }
} catch (e) {
    Nexus.tui.error("File operation failed: " + e);
}

// =====================================================
// FINAL REPORT
// =====================================================
Nexus.tui.markdown("---\n## ✅ Test Complete!");
Nexus.tui.print("\nAll Nexus modules are working correctly.", "success");
Nexus.tui.info("You can now create your own .nx.js scripts!");
