# Nexus Scripting Guide

Welcome to the Nexus development manual. This guide will teach you how to write `.nx.js` drivers to automate the web.

## 1. Anatomy of a Script

A Nexus script is a standard Javascript file (ES5+) that interacts with the `Nexus` global object.

```javascript
export const meta = {
  name: "example",
  version: "1.0",
  description: "My first Nexus agent",
};

// Main execution
var query = Nexus.env.get("ARG1") || "default";
Nexus.tui.print("Running Example with: " + query);
```

## 2. API Reference

### `Nexus.http`

Make HTTP requests with automatic header management.

```javascript
var resp = Nexus.http.get("https://example.com");
var json = Nexus.http.post("https://api.site.com", {
  headers: { Authorization: "Bearer ..." },
  body: JSON.stringify({ data: 1 }),
});
```

### `Nexus.dom`

Parse HTML responses.

```javascript
var html = Nexus.http.get("https://news.ycombinator.com").body;
var titles = Nexus.dom.select(html, ".titleline > a");

titles.forEach(function (el) {
  console.log(el.text(), el.attr("href"));
});
```

### `Nexus.tui`

Render beautiful output.

```javascript
Nexus.tui.header("My Dashboard");
Nexus.tui.table(
  ["ID", "Name"],
  [
    [1, "Alice"],
    [2, "Bob"],
  ]
);
var name = Nexus.tui.input("What is your name?");
```

### `Nexus.sys`

System operations.

```javascript
Nexus.sys.save("data.json", JSON.stringify(data));
var exists = Nexus.sys.exists("config.json");
Nexus.sys.mkdir("downloads");
Nexus.sys.download("https://img.com/cat.jpg", "cat.jpg");
```

### `Nexus.secure` (New in v3.0)

Securely manage sensitive data.

```javascript
// Setup (run once)
Nexus.secure.set("api_key", "secret_123");

// Usage
var key = Nexus.secure.get("api_key");
```

## 3. Best Practices (Anti-Bot Evasion)

- Always set distinct **User-Agent** headers if the target blocks generic ones.
- Use `Nexus.sys.wait(1000)` random delays between requests.
- Don't scrape too fast; respect `robots.txt`.

## 4. Publishing

Host your script on a URL (GitHub Raw is perfect) and share it!
Users can install via:

```bash
nexus add @your-script <raw_url>
```
