var meta = {
    name: "whois",
    version: "1.0",
    description: "Domain Whois Lookup"
};

var args = __args__;
var domain = "google.com";

if (args && args.length > 2) {
    domain = args[2];
}

Nexus.tui.header("Whois Lookup: " + domain);

// Using a public RDAP/Whois API (e.g. rdap.org)
var url = "https://rdap.org/domain/" + domain;
var resp = Nexus.http.get(url);

if (resp.status == 200) {
    var data = JSON.parse(resp.body);
    
    // RDAP structure varies, trying standard fields
    var handle = data.handle || "N/A";
    var events = data.events || [];
    var reg = "Unknown";
    var exp = "Unknown";

    events.forEach(function(e) {
        if (e.eventAction === "registration") reg = e.eventDate;
        if (e.eventAction === "expiration") exp = e.eventDate;
    });

    Nexus.tui.table(
        ["Field", "Value"],
        [
            ["Handle", handle],
            ["Registered", reg],
            ["Expires", exp],
            ["Status", (data.status || []).join(", ")]
        ]
    );
} else {
    Nexus.tui.print("Error fetching WHOIS data (or domain not found).");
}
