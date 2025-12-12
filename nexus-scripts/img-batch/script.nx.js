var meta = {
    name: "img-batch",
    version: "1.0",
    description: "Download a batch of images"
};

var args = __args__;
// Usage: nexus @img-batch url1 url2 ...

if (!args || args.length < 3) {
    Nexus.tui.print("Usage: nexus @img-batch <url1> [url2] ...");
} else {
    Nexus.tui.header("Batch Downloader");
    Nexus.sys.mkdir("downloads");

    var urls = args.slice(2);
    urls.forEach(function(url, idx) {
        var name = "image_" + Date.now() + "_" + idx + ".jpg";
        Nexus.tui.print("Downloading " + url + "...");
        
        var success = Nexus.sys.download(url, name);
        if (success) {
            Nexus.tui.print("✅ Saved to downloads/" + name);
        } else {
            Nexus.tui.print("❌ Failed: " + url);
        }
    });
}
