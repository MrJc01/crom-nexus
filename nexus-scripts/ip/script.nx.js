var meta = {
    name: "ip",
    version: "1.0",
    description: "Show public IP address"
};

Nexus.tui.header("Public IP Address");

var url = "https://api.ipify.org?format=json";
var resp = Nexus.http.get(url);

if (resp.status == 200) {
    var data = JSON.parse(resp.body);
    Nexus.tui.print("Global IP: " + data.ip);
} else {
    Nexus.tui.print("Error: " + resp.status);
}
