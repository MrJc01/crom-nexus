var meta = {
    name: "joke",
    version: "1.0",
    description: "Get a random programming joke"
};

Nexus.tui.header("Random Joke");

var url = "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political&type=twopart";
var resp = Nexus.http.get(url);

if (resp.status == 200) {
    var joke = JSON.parse(resp.body);
    Nexus.tui.print("❓ " + joke.setup);
    Nexus.sys.wait(2000); // Dramatic pause (if sys.wait existed, otherwise instantaneous)
    Nexus.tui.print("❗ " + joke.delivery);
} else {
    Nexus.tui.print("Error getting joke. :(");
}
