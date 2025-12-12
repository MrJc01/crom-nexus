var meta = {
    name: "hackernews",
    version: "1.0",
    description: "Read Hacker News Top Stories"
};

Nexus.tui.header("Hacker News Top Stories");

var url = "https://hacker-news.firebaseio.com/v0/topstories.json";
var resp = Nexus.http.get(url);

if (resp.status == 200) {
    var ids = JSON.parse(resp.body).slice(0, 5); // Get top 5
    var tableData = [];

    ids.forEach(function(id) {
        var itemUrl = "https://hacker-news.firebaseio.com/v0/item/" + id + ".json";
        var itemResp = Nexus.http.get(itemUrl);
        if (itemResp.status == 200) {
            var item = JSON.parse(itemResp.body);
            tableData.push([item.score.toString(), item.title]);
        }
    });

    Nexus.tui.table(["Pts", "Title"], tableData);
} else {
    Nexus.tui.print("Error fetching HN.");
}
