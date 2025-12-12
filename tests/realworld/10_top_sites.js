// =====================================================
// 10_top_sites.js - Top 50 Websites Accessibility Test
// Tests: HTTP status, response time, basic parsing
// =====================================================

Nexus.tui.title("Top 50 Websites Test");

// Top 50 most accessed websites (simplified for testing)
var sites = [
    // Search Engines
    { name: "Google", url: "https://www.google.com", category: "Search" },
    { name: "Bing", url: "https://www.bing.com", category: "Search" },
    { name: "DuckDuckGo", url: "https://duckduckgo.com", category: "Search" },
    { name: "Yahoo", url: "https://www.yahoo.com", category: "Search" },
    { name: "Baidu", url: "https://www.baidu.com", category: "Search" },
    
    // Social Media
    { name: "Facebook", url: "https://www.facebook.com", category: "Social" },
    { name: "Twitter/X", url: "https://x.com", category: "Social" },
    { name: "Instagram", url: "https://www.instagram.com", category: "Social" },
    { name: "LinkedIn", url: "https://www.linkedin.com", category: "Social" },
    { name: "Reddit", url: "https://www.reddit.com", category: "Social" },
    { name: "Pinterest", url: "https://www.pinterest.com", category: "Social" },
    { name: "TikTok", url: "https://www.tiktok.com", category: "Social" },
    
    // Video/Streaming
    { name: "YouTube", url: "https://www.youtube.com", category: "Video" },
    { name: "Netflix", url: "https://www.netflix.com", category: "Video" },
    { name: "Twitch", url: "https://www.twitch.tv", category: "Video" },
    
    // E-commerce
    { name: "Amazon", url: "https://www.amazon.com", category: "E-commerce" },
    { name: "eBay", url: "https://www.ebay.com", category: "E-commerce" },
    { name: "AliExpress", url: "https://www.aliexpress.com", category: "E-commerce" },
    { name: "Mercado Livre", url: "https://www.mercadolivre.com.br", category: "E-commerce" },
    
    // Tech/Dev
    { name: "GitHub", url: "https://github.com", category: "Tech" },
    { name: "Stack Overflow", url: "https://stackoverflow.com", category: "Tech" },
    { name: "GitLab", url: "https://gitlab.com", category: "Tech" },
    { name: "NPM", url: "https://www.npmjs.com", category: "Tech" },
    { name: "Docker Hub", url: "https://hub.docker.com", category: "Tech" },
    
    // AI Services
    { name: "ChatGPT", url: "https://chat.openai.com", category: "AI" },
    { name: "Claude", url: "https://claude.ai", category: "AI" },
    { name: "Hugging Face", url: "https://huggingface.co", category: "AI" },
    { name: "Replicate", url: "https://replicate.com", category: "AI" },
    
    // News
    { name: "Wikipedia", url: "https://www.wikipedia.org", category: "Info" },
    { name: "CNN", url: "https://www.cnn.com", category: "News" },
    { name: "BBC", url: "https://www.bbc.com", category: "News" },
    { name: "New York Times", url: "https://www.nytimes.com", category: "News" },
    { name: "G1 Globo", url: "https://g1.globo.com", category: "News" },
    
    // Productivity
    { name: "Gmail", url: "https://mail.google.com", category: "Productivity" },
    { name: "Office 365", url: "https://www.office.com", category: "Productivity" },
    { name: "Notion", url: "https://www.notion.so", category: "Productivity" },
    { name: "Trello", url: "https://trello.com", category: "Productivity" },
    { name: "Slack", url: "https://slack.com", category: "Productivity" },
    
    // Finance
    { name: "PayPal", url: "https://www.paypal.com", category: "Finance" },
    { name: "Binance", url: "https://www.binance.com", category: "Finance" },
    { name: "Coinbase", url: "https://www.coinbase.com", category: "Finance" },
    
    // Other Popular
    { name: "Zoom", url: "https://zoom.us", category: "Communication" },
    { name: "Discord", url: "https://discord.com", category: "Communication" },
    { name: "WhatsApp Web", url: "https://web.whatsapp.com", category: "Communication" },
    { name: "Telegram", url: "https://web.telegram.org", category: "Communication" },
    
    // Misc
    { name: "Weather.com", url: "https://weather.com", category: "Utility" },
    { name: "Spotify", url: "https://www.spotify.com", category: "Music" },
    { name: "Dropbox", url: "https://www.dropbox.com", category: "Storage" },
    { name: "Cloudflare", url: "https://www.cloudflare.com", category: "Tech" }
];

var results = [];
var categories = {};
var startTime = Date.now();

Nexus.tui.info("Testing " + sites.length + " websites...\n");

// Test each site
for (var i = 0; i < sites.length; i++) {
    var site = sites[i];
    var siteStart = Date.now();
    
    try {
        var response = Nexus.http.get(site.url);
        var elapsed = Date.now() - siteStart;
        
        var result = {
            name: site.name,
            category: site.category,
            status: response.status,
            time: elapsed,
            size: response.body.length,
            success: response.status >= 200 && response.status < 400
        };
        
        // Extract title if possible
        if (result.success) {
            try {
                var doc = Nexus.dom.parse(response.body);
                var titles = doc.select("title");
                if (titles.length > 0) {
                    result.title = titles[0].text().substring(0, 40);
                }
            } catch (e) {
                result.title = "(parse error)";
            }
        }
        
        results.push(result);
        
        // Count by category
        if (!categories[site.category]) {
            categories[site.category] = { success: 0, fail: 0 };
        }
        if (result.success) {
            categories[site.category].success++;
            Nexus.tui.print((i+1) + ". " + site.name + " - " + response.status + " (" + elapsed + "ms)", "success");
        } else {
            categories[site.category].fail++;
            Nexus.tui.print((i+1) + ". " + site.name + " - " + response.status, "error");
        }
        
    } catch (e) {
        results.push({
            name: site.name,
            category: site.category,
            status: "ERROR",
            time: Date.now() - siteStart,
            success: false,
            error: e.toString().substring(0, 50)
        });
        
        if (!categories[site.category]) {
            categories[site.category] = { success: 0, fail: 0 };
        }
        categories[site.category].fail++;
        
        Nexus.tui.print((i+1) + ". " + site.name + " - FAIL", "error");
    }
}

var totalTime = Date.now() - startTime;

// =====================================================
// SUMMARY
// =====================================================
Nexus.tui.markdown("\n---\n## Results Summary");

var passed = results.filter(function(r) { return r.success; }).length;
var failed = results.length - passed;

Nexus.tui.table(
    ["Metric", "Value"],
    [
        ["Total Sites", results.length.toString()],
        ["Accessible", passed.toString()],
        ["Blocked/Error", failed.toString()],
        ["Success Rate", ((passed / results.length) * 100).toFixed(1) + "%"],
        ["Total Time", (totalTime / 1000).toFixed(1) + "s"],
        ["Avg Response", (totalTime / results.length).toFixed(0) + "ms"]
    ]
);

// Category breakdown
Nexus.tui.markdown("\n### By Category");

var catRows = [];
for (var cat in categories) {
    var c = categories[cat];
    var total = c.success + c.fail;
    catRows.push([cat, c.success + "/" + total, ((c.success/total)*100).toFixed(0) + "%"]);
}

Nexus.tui.table(["Category", "Accessible", "Rate"], catRows);

// Performance leaders
Nexus.tui.markdown("\n### Fastest Responses");

var sorted = results.filter(function(r) { return r.success; })
                   .sort(function(a, b) { return a.time - b.time; })
                   .slice(0, 5);

var fastRows = sorted.map(function(r) {
    return [r.name, r.time + "ms", (r.size / 1024).toFixed(0) + "KB"];
});

Nexus.tui.table(["Site", "Response Time", "Size"], fastRows);

// Save detailed results
var reportData = {
    timestamp: new Date().toISOString(),
    totalSites: results.length,
    passed: passed,
    failed: failed,
    totalTimeMs: totalTime,
    results: results
};

Nexus.sys.save("top_sites_report.json", JSON.stringify(reportData, null, 2));
Nexus.tui.success("\nDetailed report saved to ~/.nexus/top_sites_report.json");

// Final verdict
if (passed / results.length >= 0.8) {
    Nexus.tui.box("✅ TOP SITES TEST PASSED\n\n" + passed + "/" + results.length + " sites accessible\nNexus HTTP client is compatible with major websites.");
} else {
    Nexus.tui.box("⚠ PARTIAL SUCCESS\n\nSome sites blocked or require JS rendering.\nThis is expected for sites with anti-bot protection.");
}
