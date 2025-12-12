var meta = {
    name: "quote",
    version: "1.0",
    description: "Get an inspirational quote"
};

Nexus.tui.header("Daily Wisdom");

// Using a reliable quote API
var url = "https://api.quotable.io/random?tags=technology,science";
// Often unstable, let's use a mock backup if fail, or try fetch
var resp = Nexus.http.get(url);

if (resp.status == 200) {
    var data = JSON.parse(resp.body);
    Nexus.tui.print('"' + data.content + '"');
    Nexus.tui.print("- " + data.author);
} else {
    // Fallback
    Nexus.tui.print('"Simplicity is the soul of efficiency."');
    Nexus.tui.print("- Austin Freeman");
}
