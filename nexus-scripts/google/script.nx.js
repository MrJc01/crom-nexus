// Google Search Script using nx helper
nx.title("Google Search");

var args = typeof __args !== "undefined" ? __args : [];
var cmd = args[0] || "help";
var query = args.slice(1).join(" ");

if (cmd === "search" && query) {
    nx.info("Searching: " + query);
    var url = "https://www.google.com/search?q=" + encodeURIComponent(query);
    
    try {
        var response = nx.get(url);
        var doc = nx.parse(response.body);
        var links = doc.select("a");
        
        var results = [];
        for (var i = 0; i < links.length && results.length < 10; i++) {
            var href = links[i].attr("href");
            var text = links[i].text();
            if (href.indexOf("/url?q=") === 0 && text.length > 5) {
                var realUrl = decodeURIComponent(href.replace("/url?q=", "").split("&")[0]);
                if (realUrl.indexOf("http") === 0) {
                    results.push({ title: text.substring(0, 50), url: realUrl });
                }
            }
        }
        
        if (results.length > 0) {
            nx.showTable(["#", "Title", "URL"], 
                results.map(function(r, i) { return { n: i+1, title: r.title, url: r.url.substring(0, 40) }; }),
                ["n", "title", "url"]);
            nx.save("google_results.json", results);
            nx.success(results.length + " results saved");
        } else {
            nx.warn("No results found");
        }
    } catch (e) {
        nx.error("Search failed: " + e);
    }
} else if (cmd === "open" && args[1]) {
    var data = nx.loadJSON("google_results.json");
    if (data && data[parseInt(args[1]) - 1]) {
        nx.open(data[parseInt(args[1]) - 1].url);
    }
} else {
    nx.md("## Usage\n- `search <query>` - Search Google\n- `open <#>` - Open result");
}
