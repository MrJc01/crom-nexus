// =====================================================
// 05_workflow_mock.js - Real-World Workflow Simulation
// Simulates a complete @google-like entity workflow
// Tests: End-to-end integration of all modules
// =====================================================

Nexus.tui.title("Workflow Simulation: @search Entity");

// =====================================================
// MOCK DATA: Simulated search results HTML
// (Avoids network dependency for reliable testing)
// =====================================================
var mockSearchHTML = `
<!DOCTYPE html>
<html>
<head><title>Search Results</title></head>
<body>
    <div id="search-results">
        <div class="result">
            <a href="https://golang.org" class="result-link">
                <h3 class="result-title">The Go Programming Language</h3>
            </a>
            <p class="result-desc">Go is an open source programming language that makes it easy to build simple, reliable, and efficient software.</p>
        </div>
        <div class="result">
            <a href="https://go.dev" class="result-link">
                <h3 class="result-title">Go Developer Portal</h3>
            </a>
            <p class="result-desc">Official documentation, tutorials, and downloads for the Go programming language.</p>
        </div>
        <div class="result">
            <a href="https://github.com/golang/go" class="result-link">
                <h3 class="result-title">golang/go: The Go programming language</h3>
            </a>
            <p class="result-desc">GitHub repository for the Go programming language. Contribute to golang/go development.</p>
        </div>
        <div class="result">
            <a href="https://tour.golang.org" class="result-link">
                <h3 class="result-title">A Tour of Go</h3>
            </a>
            <p class="result-desc">An interactive introduction to Go in three sections covering basic syntax, methods, and concurrency.</p>
        </div>
        <div class="result">
            <a href="https://gobyexample.com" class="result-link">
                <h3 class="result-title">Go by Example</h3>
            </a>
            <p class="result-desc">Hands-on introduction to Go using annotated example programs.</p>
        </div>
    </div>
</body>
</html>
`;

// =====================================================
// STEP 1: Simulate fetching search results
// =====================================================
Nexus.tui.markdown("## Step 1: Fetching Data");
Nexus.tui.info("Query: 'golang tutorial'");
Nexus.tui.info("Simulating network request...");

// In a real entity, this would be:
// var response = Nexus.http.get("https://google.com/search?q=golang+tutorial");
// var html = response.body;

var html = mockSearchHTML; // Using mock for reliable testing
Nexus.tui.success("Data fetched (mock: " + html.length + " chars)");

// =====================================================
// STEP 2: Parse the HTML and extract results
// =====================================================
Nexus.tui.markdown("## Step 2: Parsing Results");

var doc = Nexus.dom.parse(html);
var results = doc.select(".result");

Nexus.tui.success("Found " + results.length + " search results");

// Extract structured data
var searchResults = [];
for (var i = 0; i < results.length; i++) {
    // Note: In the current DOM implementation, we select from the full doc
    // This is a simplified approach
}

// Re-select to get specific elements
var titles = doc.select(".result-title");
var links = doc.select(".result-link");
var descriptions = doc.select(".result-desc");

for (var i = 0; i < titles.length; i++) {
    searchResults.push({
        title: titles[i].text(),
        url: links[i].attr("href"),
        desc: descriptions[i].text().substring(0, 60) + "..."
    });
}

Nexus.tui.success("Extracted " + searchResults.length + " result objects");

// =====================================================
// STEP 3: Display results in a table
// =====================================================
Nexus.tui.markdown("## Step 3: Displaying Results");

var tableHeaders = ["#", "Title", "URL"];
var tableRows = [];

for (var i = 0; i < searchResults.length; i++) {
    tableRows.push([
        (i + 1).toString(),
        searchResults[i].title.substring(0, 35),
        searchResults[i].url
    ]);
}

Nexus.tui.table(tableHeaders, tableRows);

// =====================================================
// STEP 4: Show detailed view of first result
// =====================================================
Nexus.tui.markdown("## Step 4: Detailed View");

var firstResult = searchResults[0];
var detailMD = `
### ${firstResult.title}

**URL:** ${firstResult.url}

${firstResult.desc}
`;

Nexus.tui.markdown(detailMD);

// =====================================================
// STEP 5: Save results to file (like caching)
// =====================================================
Nexus.tui.markdown("## Step 5: Caching Results");

try {
    var cacheData = {
        query: "golang tutorial",
        timestamp: new Date().toISOString(),
        results: searchResults
    };
    
    Nexus.sys.save("search_cache.json", JSON.stringify(cacheData, null, 2));
    Nexus.tui.success("Results cached to ~/.nexus/search_cache.json");
} catch (e) {
    Nexus.tui.error("Cache failed: " + e);
}

// =====================================================
// WORKFLOW COMPLETE
// =====================================================
Nexus.tui.markdown("---");
Nexus.tui.box("✅ WORKFLOW SIMULATION COMPLETE\n\nThis simulates a real @search entity:\n1. Fetch HTML (mocked for testing)\n2. Parse with Nexus.dom\n3. Display with Nexus.tui\n4. Cache with Nexus.sys");

Nexus.tui.info("In production, replace mockSearchHTML with Nexus.http.get()");
