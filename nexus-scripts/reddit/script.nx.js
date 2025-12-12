var meta = {
    name: "reddit",
    version: "1.0",
    description: "Browse a subreddit"
};

var args = __args__;
var sub = "golang";

if (args && args.length > 2) {
    sub = args[2];
}

Nexus.tui.header("Reddit: r/" + sub);

var url = "https://www.reddit.com/r/" + sub + "/hot.json?limit=10";
// Add User-Agent to avoid aggressive rate limiting
var resp = Nexus.http.get(url); 
// Note: Reddit blocks simple Go requests often. In a real scenario we'd set User-Agent in core or expose it in JS.
// Assuming Nexus Core sets a proper User-Agent or Reddit might block (429/403).
// If blocked, we handle error.

if (resp.status == 200) {
    var data = JSON.parse(resp.body);
    var posts = data.data.children;
    var tableData = [];

    posts.forEach(function(p) {
        var post = p.data;
        tableData.push(["⬆ " + post.ups, post.title.substring(0, 50)]);
    });

    Nexus.tui.table(["Ups", "Title"], tableData);
} else {
    Nexus.tui.print("Error fetching Reddit (Status " + resp.status + "). They might be blocking bots.");
}
