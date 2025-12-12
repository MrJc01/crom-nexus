// Weather Script using nx helper
nx.title("Weather");

var args = typeof __args !== "undefined" ? __args : [];
var cmd = args[0] || "now";
var location = args.slice(1).join(" ") || "auto";

if (cmd === "now") {
    nx.info("Location: " + location);
    try {
        var data = nx.getJSON("https://wttr.in/" + encodeURIComponent(location) + "?format=j1");
        var c = data.current_condition[0];
        var area = data.nearest_area[0];
        
        nx.md("## " + area.areaName[0].value + ", " + area.country[0].value);
        nx.table(["Metric", "Value"], [
            ["🌡️ Temperature", c.temp_C + "°C"],
            ["🌤️ Condition", c.weatherDesc[0].value],
            ["💨 Wind", c.windspeedKmph + " km/h"],
            ["💧 Humidity", c.humidity + "%"]
        ]);
    } catch (e) {
        nx.error("Weather failed: " + e);
    }
} else if (cmd === "forecast") {
    try {
        var data = nx.getJSON("https://wttr.in/" + encodeURIComponent(location) + "?format=j1");
        var rows = data.weather.slice(0, 3).map(function(d) {
            return [d.date, d.maxtempC + "°C", d.mintempC + "°C"];
        });
        nx.table(["Date", "High", "Low"], rows);
    } catch (e) {
        nx.error("Forecast failed: " + e);
    }
} else {
    nx.md("## Usage\n- `now [city]` - Current weather\n- `forecast [city]` - 3-day forecast");
}
