// News Script using nx helper
nx.title("Hacker News");

var args = typeof __args !== "undefined" ? __args : [];
var cmd = args[0] || "top";

if (cmd === "top") {
    nx.info("Fetching top stories...");
    try {
        var ids = nx.getJSON("https://hacker-news.firebaseio.com/v0/topstories.json").slice(0, 10);
        var stories = [];
        
        for (var i = 0; i < ids.length; i++) {
            var s = nx.getJSON("https://hacker-news.firebaseio.com/v0/item/" + ids[i] + ".json");
            if (s && s.title) {
                stories.push({ title: s.title.substring(0, 45), score: s.score, url: s.url || "#" });
            }
        }
        
        nx.showTable(["#", "Title", "Score"], 
            stories.map(function(s, i) { return { n: i+1, title: s.title, score: "↑" + s.score }; }),
            ["n", "title", "score"]);
        
        nx.save("hn_stories.json", stories);
        nx.success(stories.length + " stories loaded");
    } catch (e) {
        nx.error("Failed: " + e);
    }
} else if (cmd === "open" && args[1]) {
    var data = nx.loadJSON("hn_stories.json");
    if (data && data[parseInt(args[1]) - 1]) {
        nx.open(data[parseInt(args[1]) - 1].url);
    }
} else {
    nx.md("## Usage\n- `top` - Top 10 stories\n- `open <#>` - Open story");
}
