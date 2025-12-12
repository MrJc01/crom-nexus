// =====================================================
// nx.js - Nexus Helper Library
// Simplifies common operations for script developers
// =====================================================

var nx = {
    // =====================================================
    // HTTP Helpers
    // =====================================================
    
    getJSON: function(url, headers) {
        var opts = { method: "GET", url: url, headers: headers || {} };
        var response = Nexus.http.request(opts);
        if (response.status >= 200 && response.status < 300) {
            return JSON.parse(response.body);
        }
        throw new Error("HTTP " + response.status);
    },
    
    postJSON: function(url, data, headers) {
        var opts = {
            method: "POST",
            url: url,
            body: JSON.stringify(data),
            headers: Object.assign({ "Content-Type": "application/json" }, headers || {})
        };
        var response = Nexus.http.request(opts);
        return JSON.parse(response.body);
    },
    
    get: function(url) {
        return Nexus.http.get(url);
    },
    
    // =====================================================
    // DOM Helpers
    // =====================================================
    
    parse: function(html) {
        return Nexus.dom.parse(html);
    },
    
    scrape: function(url, selector) {
        var response = Nexus.http.get(url);
        var doc = Nexus.dom.parse(response.body);
        return doc.select(selector);
    },
    
    // =====================================================
    // Output Helpers
    // =====================================================
    
    print: function(text) { Nexus.tui.print(text); },
    success: function(text) { Nexus.tui.success(text); },
    error: function(text) { Nexus.tui.error(text); },
    info: function(text) { Nexus.tui.info(text); },
    warn: function(text) { Nexus.tui.warn(text); },
    title: function(text) { Nexus.tui.title(text); },
    
    table: function(headers, rows) {
        Nexus.tui.table(headers, rows);
    },
    
    // Table from array of objects
    showTable: function(headers, data, keys) {
        var rows = data.map(function(item) {
            return keys.map(function(key) {
                return String(item[key] || "");
            });
        });
        Nexus.tui.table(headers, rows);
    },
    
    md: function(text) { Nexus.tui.markdown(text); },
    box: function(text) { Nexus.tui.box(text); },
    
    // =====================================================
    // Input Helpers
    // =====================================================
    
    ask: function(prompt) {
        return Nexus.tui.input(prompt);
    },
    
    password: function(prompt) {
        return Nexus.tui.input(prompt, { mask: true });
    },
    
    confirm: function(question) {
        return Nexus.tui.confirm(question);
    },
    
    select: function(prompt, options) {
        return Nexus.tui.list(prompt, options);
    },
    
    // =====================================================
    // File Helpers
    // =====================================================
    
    save: function(file, data) {
        if (typeof data === "object") {
            data = JSON.stringify(data, null, 2);
        }
        Nexus.sys.save(file, data);
    },
    
    load: function(file) {
        return Nexus.sys.load(file);
    },
    
    loadJSON: function(file) {
        var content = Nexus.sys.load(file);
        return content ? JSON.parse(content) : null;
    },
    
    exists: function(file) {
        return Nexus.sys.exists(file);
    },
    
    // =====================================================
    // Utility Helpers
    // =====================================================
    
    open: function(url) {
        Nexus.sys.open(url);
    },
    
    sleep: function(ms) {
        var start = Date.now();
        while (Date.now() - start < ms) {}
    },
    
    env: function(key) {
        return Nexus.sys.env(key);
    }
};
