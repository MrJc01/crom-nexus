var meta = {
    name: "currency",
    version: "1.0",
    description: "Currency Converter"
};

var args = __args__;
if (!args || args.length < 4) {
    Nexus.tui.print("Usage: nexus @currency <amount> <from> <to>");
    Nexus.tui.print("Example: nexus @currency 100 USD EUR");
} else {
    var amount = args[2];
    var from = args[3].toUpperCase();
    var to = args[4].toUpperCase(); // Optional, default functionality logic needed if not multiple args

    Nexus.tui.header("Converting " + amount + " " + from + " to " + to);

    // Using a free API (e.g. frankfurter.app for major currencies)
    var url = "https://api.frankfurter.app/latest?amount=" + amount + "&from=" + from + "&to=" + to;
    var resp = Nexus.http.get(url);

    if (resp.status == 200) {
        var data = JSON.parse(resp.body);
        if (data.rates && data.rates[to]) {
            Nexus.tui.print("💰 Result: " + data.rates[to] + " " + to);
        } else {
            Nexus.tui.print("Error: Rate not found.");
        }
    } else {
        Nexus.tui.print("Error fetching rates: " + resp.status);
    }
}
