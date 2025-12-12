var meta = {
    name: "env",
    version: "1.0",
    description: "Inspect Environment Variables"
};

Nexus.tui.header("Env Vars");

var vars = ["PATH", "HOME", "USER", "SHELL", "TERM", "LANG"];
var data = [];

vars.forEach(function(v) {
    data.push([v, Nexus.sys.env(v) || ""]);
});

Nexus.tui.table(["Variable", "Value"], data);
