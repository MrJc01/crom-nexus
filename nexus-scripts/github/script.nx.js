// GitHub Script using nx helper
nx.title("GitHub");

var args = typeof __args !== "undefined" ? __args : [];
var cmd = args[0] || "help";
var target = args[1] || "";

var api = function(path) {
    return nx.getJSON("https://api.github.com" + path);
};

if (cmd === "repo" && target.indexOf("/") > 0) {
    nx.info("Fetching: " + target);
    try {
        var repo = api("/repos/" + target);
        nx.md("## " + repo.full_name);
        nx.print(repo.description || "No description", "info");
        nx.table(["Metric", "Value"], [
            ["⭐ Stars", repo.stargazers_count.toLocaleString()],
            ["🍴 Forks", repo.forks_count.toLocaleString()],
            ["💻 Language", repo.language || "N/A"],
            ["📄 License", repo.license ? repo.license.name : "None"]
        ]);
    } catch (e) {
        nx.error("Repo fetch failed: " + e);
    }
} else if (cmd === "user" && target) {
    try {
        var user = api("/users/" + target);
        nx.md("## " + (user.name || user.login));
        nx.table(["Info", "Value"], [
            ["📦 Repos", user.public_repos.toString()],
            ["👥 Followers", user.followers.toLocaleString()],
            ["📍 Location", user.location || "N/A"]
        ]);
    } catch (e) {
        nx.error("User fetch failed: " + e);
    }
} else if (cmd === "search" && args.slice(1).length > 0) {
    var q = args.slice(1).join(" ");
    try {
        var data = api("/search/repositories?q=" + encodeURIComponent(q) + "&per_page=5");
        var rows = data.items.map(function(r, i) {
            return [(i+1).toString(), r.full_name.substring(0, 25), "⭐" + r.stargazers_count];
        });
        nx.table(["#", "Repo", "Stars"], rows);
    } catch (e) {
        nx.error("Search failed: " + e);
    }
} else {
    nx.md("## Usage\n- `repo owner/name`\n- `user username`\n- `search query`");
}
