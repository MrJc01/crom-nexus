var meta = {
    name: "monitor",
    version: "1.0",
    description: "System Resource Monitor"
};

Nexus.tui.header("System Monitor");

// We can read /proc/loadavg on Linux or just show Env vars
// Since we are cross-platform, let's show environment for now or mock stats
// Nexus.sys.env is available.

var user = Nexus.sys.env("USERNAME") || Nexus.sys.env("USER");
var os = Nexus.sys.env("OS") || "Unknown OS";

Nexus.tui.table(
    ["Metric", "Value"],
    [
        ["User", user],
        ["OS", os],
        ["Time", new Date().toLocaleTimeString()],
        ["Nexus Version", "3.0.0"]
    ]
);

Nexus.tui.print("\nPress Ctrl+C to exit.");
