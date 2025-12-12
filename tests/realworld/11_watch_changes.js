// =====================================================
// 11_watch_changes.js - Change Detection Test
// =====================================================

Nexus.tui.title("Website Change Detection");

var targets = [
    { name: "HN API", url: "https://hacker-news.firebaseio.com/v0/topstories.json" },
    { name: "Example", url: "https://example.com" },
    { name: "GitHub Status", url: "https://www.githubstatus.com/api/v2/status.json" }
];

function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) {
        h = ((h << 5) - h) + s.charCodeAt(i);
        h = h & h;
    }
    return h.toString();
}

Nexus.tui.info("Checking " + targets.length + " targets...\n");

var changes = 0;
for (var i = 0; i < targets.length; i++) {
    var t = targets[i];
    try {
        var r = Nexus.http.get(t.url);
        var h = hash(r.body);
        var file = "watch_" + t.name.replace(/\s+/g, "_") + ".json";
        var prev = Nexus.sys.load(file);
        
        if (prev) {
            var p = JSON.parse(prev);
            if (p.hash !== h) {
                Nexus.tui.print(t.name + " - 🔔 CHANGED!", "warn");
                changes++;
            } else {
                Nexus.tui.print(t.name + " - ✓ Same", "success");
            }
        } else {
            Nexus.tui.print(t.name + " - 📝 First check", "info");
        }
        
        Nexus.sys.save(file, JSON.stringify({ hash: h, time: Date.now() }));
    } catch (e) {
        Nexus.tui.print(t.name + " - ❌ Error", "error");
    }
}

Nexus.tui.box(changes > 0 ? "🔔 " + changes + " changes detected!" : "✓ No changes");
