var meta = {
    name: "todo",
    version: "1.0",
    description: "Simple CLI Todo List"
};

var args = __args__;
var file = "todo.json";

function load() {
    var content = Nexus.sys.load(file);
    if (!content) return [];
    try { return JSON.parse(content); } catch (e) { return []; }
}

function save(list) {
    Nexus.sys.save(file, JSON.stringify(list));
}

var cmd = (args && args.length > 2) ? args[2] : "list";
var item = (args && args.length > 3) ? args.slice(3).join(" ") : "";

var list = load();

if (cmd === "add") {
    list.push({text: item, done: false});
    save(list);
    Nexus.tui.print("Added: " + item);
} else if (cmd === "done") {
    var index = parseInt(item) - 1;
    if (list[index]) {
        list[index].done = true;
        save(list);
        Nexus.tui.print("Marked #" + (index+1) + " as done.");
    }
} else if (cmd === "clean") {
    list = list.filter(function(i) { return !i.done; });
    save(list);
    Nexus.tui.print("Cleaned completed items.");
} else {
    Nexus.tui.header("Todo List");
    if (list.length === 0) Nexus.tui.print("Nothing to do!");
    list.forEach(function(i, idx) {
        var status = i.done ? "[x]" : "[ ]";
        Nexus.tui.print((idx + 1) + ". " + status + " " + i.text);
    });
}
