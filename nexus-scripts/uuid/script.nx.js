var meta = {
    name: "uuid",
    version: "1.0",
    description: "Generate UUIDs"
};

Nexus.tui.header("UUID Generator");

// Simple UUID v4 implementation in JS
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

var count = 1;
var args = __args__;
if (args && args.length > 2) {
    count = parseInt(args[2]) || 1;
}

for (var i = 0; i < count; i++) {
    Nexus.tui.print(uuidv4());
}
