// =====================================================
// weather.nx.js - Weather Entity Driver
// Usage: nexus @weather now "City Name"
// Uses free wttr.in API
// =====================================================

export const meta = {
    name: "Weather",
    version: "1.0",
    description: "Get weather information via terminal",
    author: "Nexus",
    commands: {
        "now": "Current weather for a location",
        "forecast": "3-day forecast",
        "moon": "Moon phase"
    }
};

export function now(args) {
    var location = args.join(" ") || "auto";
    
    Nexus.tui.title("Weather Report");
    Nexus.tui.info("Location: " + (location === "auto" ? "Auto-detect" : location));
    
    try {
        // wttr.in provides weather in terminal-friendly format
        var url = "https://wttr.in/" + encodeURIComponent(location) + "?format=j1";
        var response = Nexus.http.get(url);
        
        if (response.status === 200) {
            var data = JSON.parse(response.body);
            var current = data.current_condition[0];
            var area = data.nearest_area[0];
            
            var locationName = area.areaName[0].value + ", " + area.country[0].value;
            
            Nexus.tui.markdown("## " + locationName);
            
            Nexus.tui.table(
                ["Metric", "Value"],
                [
                    ["🌡️ Temperature", current.temp_C + "°C / " + current.temp_F + "°F"],
                    ["🌤️ Condition", current.weatherDesc[0].value],
                    ["💨 Wind", current.windspeedKmph + " km/h " + current.winddir16Point],
                    ["💧 Humidity", current.humidity + "%"],
                    ["👁️ Visibility", current.visibility + " km"],
                    ["🌡️ Feels Like", current.FeelsLikeC + "°C"]
                ]
            );
            
            // Save latest weather
            Nexus.sys.save("weather_cache.json", JSON.stringify({
                location: locationName,
                timestamp: new Date().toISOString(),
                data: current
            }, null, 2));
            
            Nexus.tui.success("\nWeather data cached.");
            
        } else {
            Nexus.tui.error("Could not fetch weather: " + response.status);
        }
        
    } catch (e) {
        Nexus.tui.error("Weather request failed: " + e);
        
        // Fallback: Try text format
        try {
            Nexus.tui.info("Trying alternative format...");
            var textUrl = "https://wttr.in/" + encodeURIComponent(location) + "?format=3";
            var textResponse = Nexus.http.get(textUrl);
            if (textResponse.status === 200) {
                Nexus.tui.box(textResponse.body);
            }
        } catch (e2) {
            Nexus.tui.error("All weather sources failed");
        }
    }
}

export function forecast(args) {
    var location = args.join(" ") || "auto";
    
    Nexus.tui.title("3-Day Forecast");
    Nexus.tui.info("Location: " + location);
    
    try {
        var url = "https://wttr.in/" + encodeURIComponent(location) + "?format=j1";
        var response = Nexus.http.get(url);
        
        if (response.status === 200) {
            var data = JSON.parse(response.body);
            
            var rows = [];
            for (var i = 0; i < data.weather.length && i < 3; i++) {
                var day = data.weather[i];
                rows.push([
                    day.date,
                    day.maxtempC + "°C",
                    day.mintempC + "°C",
                    day.hourly[4].weatherDesc[0].value.substring(0, 20)
                ]);
            }
            
            Nexus.tui.table(["Date", "High", "Low", "Condition"], rows);
        }
        
    } catch (e) {
        Nexus.tui.error("Forecast failed: " + e);
    }
}

export function moon(args) {
    Nexus.tui.title("Moon Phase");
    
    try {
        var url = "https://wttr.in/Moon?format=j1";
        var response = Nexus.http.get(url);
        
        if (response.status === 200) {
            var data = JSON.parse(response.body);
            var astronomy = data.weather[0].astronomy[0];
            
            Nexus.tui.table(
                ["Info", "Value"],
                [
                    ["🌅 Sunrise", astronomy.sunrise],
                    ["🌇 Sunset", astronomy.sunset],
                    ["🌙 Moonrise", astronomy.moonrise],
                    ["🌑 Moonset", astronomy.moonset],
                    ["🌓 Moon Phase", astronomy.moon_phase],
                    ["💡 Illumination", astronomy.moon_illumination + "%"]
                ]
            );
        }
    } catch (e) {
        Nexus.tui.error("Moon data failed: " + e);
    }
}
