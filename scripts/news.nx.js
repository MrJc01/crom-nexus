// =====================================================
// news.nx.js - News Aggregator Entity Driver
// Usage: nexus @news headlines
// Uses free news sources
// =====================================================

export const meta = {
    name: "News",
    version: "1.0",
    description: "Aggregate news headlines from multiple sources",
    author: "Nexus",
    commands: {
        "headlines": "Top headlines",
        "tech": "Technology news",
        "hn": "Hacker News top stories"
    }
};

export function headlines() {
    Nexus.tui.title("News Headlines");
    
    // Use Hacker News API (free, no key required)
    hn([]);
}

export function hn(args) {
    Nexus.tui.title("Hacker News - Top Stories");
    Nexus.tui.info("Fetching latest stories...");
    
    try {
        // Get top story IDs
        var topUrl = "https://hacker-news.firebaseio.com/v0/topstories.json";
        var topResponse = Nexus.http.get(topUrl);
        
        if (topResponse.status === 200) {
            var storyIds = JSON.parse(topResponse.body).slice(0, 15);
            var stories = [];
            
            // Fetch each story
            for (var i = 0; i < storyIds.length; i++) {
                try {
                    var storyUrl = "https://hacker-news.firebaseio.com/v0/item/" + storyIds[i] + ".json";
                    var storyResponse = Nexus.http.get(storyUrl);
                    
                    if (storyResponse.status === 200) {
                        var story = JSON.parse(storyResponse.body);
                        if (story && story.title) {
                            stories.push({
                                id: story.id,
                                title: story.title,
                                score: story.score || 0,
                                comments: story.descendants || 0,
                                url: story.url || "https://news.ycombinator.com/item?id=" + story.id,
                                by: story.by
                            });
                        }
                    }
                } catch (e) {
                    // Skip failed stories
                }
            }
            
            // Display stories
            var rows = stories.map(function(s, i) {
                return [
                    (i+1).toString(),
                    s.title.substring(0, 45) + (s.title.length > 45 ? "..." : ""),
                    "↑" + s.score,
                    "💬" + s.comments
                ];
            });
            
            Nexus.tui.table(["#", "Title", "Score", "Comments"], rows);
            
            Nexus.tui.success("\n" + stories.length + " stories loaded.");
            Nexus.tui.info("View story: nexus @news open 1");
            
            // Save for reference
            Nexus.sys.save("hn_stories.json", JSON.stringify(stories, null, 2));
            
        } else {
            Nexus.tui.error("Failed to fetch Hacker News: " + topResponse.status);
        }
        
    } catch (e) {
        Nexus.tui.error("HN request failed: " + e);
    }
}

export function tech() {
    Nexus.tui.title("Tech News");
    
    // Fetch from multiple tech sources
    var sources = [
        { name: "Hacker News", fn: hn }
    ];
    
    Nexus.tui.info("Aggregating from " + sources.length + " sources...");
    hn([]);
}

export function open(args) {
    var index = parseInt(args[0]) - 1;
    
    try {
        var stories = Nexus.sys.load("hn_stories.json");
        if (stories) {
            var data = JSON.parse(stories);
            if (data[index]) {
                Nexus.tui.success("Opening: " + data[index].url);
                Nexus.sys.open(data[index].url);
            } else {
                Nexus.tui.error("Invalid story number");
            }
        }
    } catch (e) {
        Nexus.tui.error("No stories cached. Run 'nexus @news hn' first.");
    }
}
