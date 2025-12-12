var meta = {
    name: "backup",
    version: "1.0",
    description: "Simple file backup utility"
};

var args = __args__;
if (!args || args.length < 4) {
    Nexus.tui.print("Usage: nexus @backup <source_file> <dest_file>");
} else {
    var src = args[2];
    var dest = args[3];

    Nexus.tui.print("Backing up " + src + " to " + dest + "...");

    // Nexus.sys.load reads file content
    var content = Nexus.sys.load(src);
    if (content === null) {
        Nexus.tui.print("❌ Error: Source file not found.");
    } else {
        Nexus.sys.save(dest, content);
        Nexus.tui.print("✅ Backup complete!");
    }
}
