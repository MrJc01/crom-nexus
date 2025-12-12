// =====================================================
// google.nx.js - Google Search Entity Driver
// Usage: nexus @google search "query"
// =====================================================

export const meta = {
    name: "Google Search",
    version: "1.0",
    description: "Search Google and extract results via terminal",
    author: "Nexus",
    commands: {
        "search": "Search Google for a query",
        "lucky": "Open first result in browser",
        "images": "Search Google Images"
    }
};

// Main search function
export function search(args) {
    var query = args.join(" ");
    
    if (!query) {
        Nexus.tui.error("Usage: nexus @google search <query>");
        return;
    }
    
    Nexus.tui.title("Google Search: " + query);
    Nexus.tui.info("Fetching results...");
    
    // Encode query for URL
    var encodedQuery = encodeURIComponent(query);
    var url = "https://www.google.com/search?q=" + encodedQuery + "&hl=en";
    
    try {
        var response = Nexus.http.request({
            method: "GET",
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept-Language": "en-US,en;q=0.9"
            }
        });
        
        if (response.status !== 200) {
            Nexus.tui.error("Google returned status: " + response.status);
            return;
        }
        
        // Parse HTML
        var doc = Nexus.dom.parse(response.body);
        
        // Extract search results (Google's structure varies)
        var results = [];
        
        // Try different selectors for Google results
        var links = doc.select("a");
        
        for (var i = 0; i < links.length && results.length < 10; i++) {
            var href = links[i].attr("href");
            var text = links[i].text();
            
            // Filter real results (not Google internal links)
            if (href && href.indexOf("/url?q=") === 0) {
                var realUrl = href.replace("/url?q=", "").split("&")[0];
                if (text && text.length > 5 && realUrl.indexOf("http") === 0) {
                    results.push({
                        title: text.substring(0, 60),
                        url: decodeURIComponent(realUrl)
                    });
                }
            }
        }
        
        if (results.length === 0) {
            Nexus.tui.warn("No results found or Google blocked the request.");
            Nexus.tui.info("Try using DuckDuckGo: nexus @ddg search \"" + query + "\"");
            return;
        }
        
        // Display results
        Nexus.tui.markdown("## Results for: " + query + "\n");
        
        var tableRows = results.map(function(r, i) {
            return [(i+1).toString(), r.title, r.url.substring(0, 40) + "..."];
        });
        
        Nexus.tui.table(["#", "Title", "URL"], tableRows);
        
        // Save results
        Nexus.sys.save("google_results.json", JSON.stringify({
            query: query,
            timestamp: new Date().toISOString(),
            results: results
        }, null, 2));
        
        Nexus.tui.success("\n" + results.length + " results found. Saved to ~/.nexus/google_results.json");
        
        // Offer to open
        Nexus.tui.info("To open a result: nexus @google open 1");
        
    } catch (e) {
        Nexus.tui.error("Search failed: " + e);
    }
}

export function lucky(args) {
    var query = args.join(" ");
    Nexus.tui.info("Searching for: " + query);
    
    // Search and open first result
    search(args);
    
    try {
        var savedResults = Nexus.sys.load("google_results.json");
        if (savedResults) {
            var data = JSON.parse(savedResults);
            if (data.results && data.results.length > 0) {
                Nexus.tui.success("Opening: " + data.results[0].url);
                Nexus.sys.open(data.results[0].url);
            }
        }
    } catch (e) {
        Nexus.tui.error("Could not open result: " + e);
    }
}

export function open(args) {
    var index = parseInt(args[0]) - 1;
    
    try {
        var savedResults = Nexus.sys.load("google_results.json");
        if (savedResults) {
            var data = JSON.parse(savedResults);
            if (data.results && data.results[index]) {
                var url = data.results[index].url;
                Nexus.tui.success("Opening: " + url);
                Nexus.sys.open(url);
            } else {
                Nexus.tui.error("Invalid result number. Run a search first.");
            }
        }
    } catch (e) {
        Nexus.tui.error("No results found. Run a search first.");
    }
}
