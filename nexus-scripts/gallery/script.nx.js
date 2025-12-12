var meta = {
    name: "gallery",
    version: "1.0",
    description: "Create HTML gallery from downloads"
};

Nexus.tui.header("Generatin Gallery");

var files = Nexus.sys.listDir("downloads");
var images = [];

files.forEach(function(f) {
    if (f.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        images.push(f.name);
    }
});

if (images.length === 0) {
    Nexus.tui.print("No images found in downloads/ folder.");
} else {
    var html = "<!DOCTYPE html><html><head><style>body{background:#222;color:#fff;font-family:sans-serif} .grid{display:flex;flex-wrap:wrap;gap:10px} img{max-width:300px;border-radius:8px}</style></head><body><h1>Gallery</h1><div class='grid'>";
    
    images.forEach(function(img) {
        html += "<div class='card'><img src='" + img + "' title='" + img + "'></div>";
    });

    html += "</div></body></html>";
    Nexus.sys.save("downloads/gallery.html", html);
    
    Nexus.tui.print("✅ Gallery created with " + images.length + " images.");
    Nexus.tui.print("Opening...");
    Nexus.sys.open("downloads/gallery.html");
}
