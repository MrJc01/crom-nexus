// =====================================================
// github.nx.js - GitHub Entity Driver
// Usage: nexus @github repo "owner/repo"
// =====================================================

export const meta = {
    name: "GitHub",
    version: "1.0",
    description: "Access GitHub repositories and stats",
    author: "Nexus",
    commands: {
        "repo": "Get repository info",
        "user": "Get user profile",
        "trending": "Show trending repos",
        "search": "Search repositories"
    }
};

export function repo(args) {
    var repoPath = args[0];
    
    if (!repoPath || repoPath.indexOf("/") === -1) {
        Nexus.tui.error("Usage: nexus @github repo owner/repo");
        Nexus.tui.info("Example: nexus @github repo torvalds/linux");
        return;
    }
    
    Nexus.tui.title("GitHub Repository");
    Nexus.tui.info("Fetching: " + repoPath);
    
    try {
        var url = "https://api.github.com/repos/" + repoPath;
        var response = Nexus.http.request({
            method: "GET",
            url: url,
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "Nexus/1.0"
            }
        });
        
        if (response.status === 200) {
            var repo = JSON.parse(response.body);
            
            Nexus.tui.markdown("## " + repo.full_name);
            Nexus.tui.print(repo.description || "No description", "info");
            
            Nexus.tui.table(
                ["Metric", "Value"],
                [
                    ["⭐ Stars", repo.stargazers_count.toLocaleString()],
                    ["🍴 Forks", repo.forks_count.toLocaleString()],
                    ["👁️ Watchers", repo.watchers_count.toLocaleString()],
                    ["🐛 Open Issues", repo.open_issues_count.toString()],
                    ["💻 Language", repo.language || "N/A"],
                    ["📄 License", repo.license ? repo.license.name : "None"],
                    ["📅 Created", repo.created_at.split("T")[0]],
                    ["🔄 Updated", repo.updated_at.split("T")[0]]
                ]
            );
            
            Nexus.tui.markdown("\n**URL:** " + repo.html_url);
            
            if (repo.homepage) {
                Nexus.tui.markdown("**Homepage:** " + repo.homepage);
            }
            
            // Topics
            if (repo.topics && repo.topics.length > 0) {
                Nexus.tui.markdown("\n**Topics:** " + repo.topics.join(", "));
            }
            
            // Save repo info
            Nexus.sys.save("github_repo.json", JSON.stringify(repo, null, 2));
            
        } else if (response.status === 404) {
            Nexus.tui.error("Repository not found: " + repoPath);
        } else {
            Nexus.tui.error("GitHub API error: " + response.status);
        }
        
    } catch (e) {
        Nexus.tui.error("GitHub request failed: " + e);
    }
}

export function user(args) {
    var username = args[0];
    
    if (!username) {
        Nexus.tui.error("Usage: nexus @github user <username>");
        return;
    }
    
    Nexus.tui.title("GitHub User");
    
    try {
        var url = "https://api.github.com/users/" + username;
        var response = Nexus.http.request({
            method: "GET",
            url: url,
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "Nexus/1.0"
            }
        });
        
        if (response.status === 200) {
            var user = JSON.parse(response.body);
            
            Nexus.tui.markdown("## " + (user.name || user.login));
            
            if (user.bio) {
                Nexus.tui.print(user.bio, "info");
            }
            
            Nexus.tui.table(
                ["Info", "Value"],
                [
                    ["👤 Username", user.login],
                    ["📍 Location", user.location || "Not specified"],
                    ["🏢 Company", user.company || "Not specified"],
                    ["📦 Public Repos", user.public_repos.toString()],
                    ["👥 Followers", user.followers.toLocaleString()],
                    ["👤 Following", user.following.toString()],
                    ["📅 Joined", user.created_at.split("T")[0]]
                ]
            );
            
            Nexus.tui.markdown("\n**Profile:** " + user.html_url);
            
        } else if (response.status === 404) {
            Nexus.tui.error("User not found: " + username);
        }
        
    } catch (e) {
        Nexus.tui.error("GitHub request failed: " + e);
    }
}

export function search(args) {
    var query = args.join(" ");
    
    if (!query) {
        Nexus.tui.error("Usage: nexus @github search <query>");
        return;
    }
    
    Nexus.tui.title("GitHub Search");
    Nexus.tui.info("Searching: " + query);
    
    try {
        var url = "https://api.github.com/search/repositories?q=" + 
                  encodeURIComponent(query) + "&sort=stars&per_page=10";
                  
        var response = Nexus.http.request({
            method: "GET",
            url: url,
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "Nexus/1.0"
            }
        });
        
        if (response.status === 200) {
            var data = JSON.parse(response.body);
            
            Nexus.tui.success("Found " + data.total_count + " repositories");
            
            var rows = data.items.map(function(repo, i) {
                return [
                    (i+1).toString(),
                    repo.full_name.substring(0, 30),
                    "⭐" + repo.stargazers_count,
                    repo.language || "N/A"
                ];
            });
            
            Nexus.tui.table(["#", "Repository", "Stars", "Language"], rows);
        }
        
    } catch (e) {
        Nexus.tui.error("Search failed: " + e);
    }
}

export function trending() {
    Nexus.tui.title("Trending Repositories");
    Nexus.tui.info("Fetching today's trending repos...");
    
    // GitHub doesn't have official trending API, so we search by recent stars
    var today = new Date();
    today.setDate(today.getDate() - 7);
    var dateStr = today.toISOString().split("T")[0];
    
    try {
        var url = "https://api.github.com/search/repositories?q=created:>" + 
                  dateStr + "&sort=stars&order=desc&per_page=10";
                  
        var response = Nexus.http.request({
            method: "GET",
            url: url,
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "Nexus/1.0"
            }
        });
        
        if (response.status === 200) {
            var data = JSON.parse(response.body);
            
            var rows = data.items.map(function(repo, i) {
                return [
                    (i+1).toString(),
                    repo.full_name.substring(0, 25),
                    "⭐" + repo.stargazers_count,
                    repo.language || "?"
                ];
            });
            
            Nexus.tui.table(["#", "Repository", "Stars", "Lang"], rows);
        }
        
    } catch (e) {
        Nexus.tui.error("Trending fetch failed: " + e);
    }
}
