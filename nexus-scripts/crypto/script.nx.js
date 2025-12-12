var meta = {
    name: "crypto",
    version: "1.0",
    description: "Fetch cryptocurrency prices"
};

var args = __args__;
var coin = "bitcoin"; // default

// Parse args (simple)
if (args && args.length > 2) {
    coin = args[2];
}

Nexus.tui.header("Crypto Tracker: " + coin);

var url = "https://api.coingecko.com/api/v3/simple/price?ids=" + coin + "&vs_currencies=usd,eur,brl";
var resp = Nexus.http.get(url);

if (resp.status != 200) {
    Nexus.tui.print("Error fetching data: " + resp.status);
} else {
    var data = JSON.parse(resp.body);
    if (!data[coin]) {
        Nexus.tui.print("Coin not found: " + coin);
    } else {
        var prices = data[coin];
        Nexus.tui.table(
            ["Currency", "Price"],
            [
                ["🇺🇸 USD", "$" + prices.usd],
                ["🇪🇺 EUR", "€" + prices.eur],
                ["🇧🇷 BRL", "R$" + prices.brl]
            ]
        );
    }
}
