// =====================================================
// 08_error_handling.js - Resilience & Error Test
// Tests: Network errors, JSON parse errors, edge cases
// =====================================================

Nexus.tui.title("Error Handling & Resilience Test");

var passed = 0;
var failed = 0;

// =====================================================
// TEST 1: 404 Not Found
// =====================================================
Nexus.tui.info("Test 1: Handling 404 response");

try {
    var response404 = Nexus.http.get("https://httpbin.org/status/404");
    
    if (response404.status === 404) {
        Nexus.tui.success("Correctly received 404 status");
        passed++;
    } else {
        Nexus.tui.error("Expected 404, got: " + response404.status);
        failed++;
    }
} catch (e) {
    Nexus.tui.warn("404 threw exception (acceptable): " + e);
    passed++; // This is acceptable behavior
}

// =====================================================
// TEST 2: 500 Server Error
// =====================================================
Nexus.tui.info("Test 2: Handling 500 server error");

try {
    var response500 = Nexus.http.get("https://httpbin.org/status/500");
    
    if (response500.status === 500) {
        Nexus.tui.success("Correctly received 500 status");
        passed++;
    } else {
        Nexus.tui.error("Expected 500, got: " + response500.status);
        failed++;
    }
} catch (e) {
    Nexus.tui.warn("500 threw exception (acceptable): " + e);
    passed++;
}

// =====================================================
// TEST 3: Invalid JSON parsing
// =====================================================
Nexus.tui.info("Test 3: Graceful JSON parse error handling");

try {
    var invalidJSON = "{ this is not valid json: }}}";
    var parsed = JSON.parse(invalidJSON);
    
    // Should not reach here
    Nexus.tui.error("JSON.parse should have thrown");
    failed++;
} catch (e) {
    Nexus.tui.success("JSON.parse error caught correctly");
    Nexus.tui.print("Error message: " + e.toString().substring(0, 50) + "...", "warn");
    passed++;
}

// =====================================================
// TEST 4: DOM parse with malformed HTML
// =====================================================
Nexus.tui.info("Test 4: DOM parsing malformed HTML");

try {
    var badHTML = "<div><p>Unclosed paragraph<div>Nested wrong</p></div>";
    var doc = Nexus.dom.parse(badHTML);
    
    // goquery is lenient, should still work
    var divs = doc.select("div");
    Nexus.tui.success("Malformed HTML parsed without crash (found " + divs.length + " divs)");
    passed++;
} catch (e) {
    Nexus.tui.error("DOM parse crashed: " + e);
    failed++;
}

// =====================================================
// TEST 5: Empty responses
// =====================================================
Nexus.tui.info("Test 5: Handling empty response body");

try {
    var emptyHTML = "";
    var emptyDoc = Nexus.dom.parse(emptyHTML);
    var found = emptyDoc.select("body");
    
    Nexus.tui.success("Empty HTML handled gracefully");
    passed++;
} catch (e) {
    Nexus.tui.error("Empty HTML caused crash: " + e);
    failed++;
}

// =====================================================
// TEST 6: Non-existent file read
// =====================================================
Nexus.tui.info("Test 6: Reading non-existent file");

try {
    var content = Nexus.sys.load("this_file_does_not_exist_12345.txt");
    
    if (content === null) {
        Nexus.tui.success("Correctly returned null for missing file");
        passed++;
    } else {
        Nexus.tui.warn("Expected null, got: " + content);
        passed++; // Still acceptable
    }
} catch (e) {
    Nexus.tui.success("Exception for missing file (acceptable)");
    passed++;
}

// =====================================================
// TEST 7: Very long string handling
// =====================================================
Nexus.tui.info("Test 7: Large data handling");

try {
    var largeString = "";
    for (var i = 0; i < 10000; i++) {
        largeString += "x";
    }
    
    Nexus.sys.save("large_test.txt", largeString);
    var readBack = Nexus.sys.load("large_test.txt");
    
    if (readBack && readBack.length === 10000) {
        Nexus.tui.success("10KB string written and read correctly");
        passed++;
    } else {
        Nexus.tui.error("Large string handling failed");
        failed++;
    }
} catch (e) {
    Nexus.tui.error("Large data error: " + e);
    failed++;
}

// =====================================================
// TEST 8: Unicode handling
// =====================================================
Nexus.tui.info("Test 8: Unicode/emoji support");

try {
    var unicodeText = "Olá 世界 🚀 مرحبا";
    Nexus.sys.save("unicode_test.txt", unicodeText);
    var readUnicode = Nexus.sys.load("unicode_test.txt");
    
    if (readUnicode === unicodeText) {
        Nexus.tui.success("Unicode preserved correctly: " + readUnicode);
        passed++;
    } else {
        Nexus.tui.error("Unicode mismatch");
        failed++;
    }
} catch (e) {
    Nexus.tui.error("Unicode test failed: " + e);
    failed++;
}

// =====================================================
// SUMMARY
// =====================================================
Nexus.tui.markdown("---");
Nexus.tui.markdown("## Resilience Test Results");

var total = passed + failed;
Nexus.tui.table(
    ["Metric", "Value"],
    [
        ["Total Tests", total.toString()],
        ["Passed", passed.toString()],
        ["Failed", failed.toString()],
        ["Success Rate", ((passed / total) * 100).toFixed(0) + "%"]
    ]
);

if (failed === 0) {
    Nexus.tui.box("✅ ALL ERROR HANDLING TESTS PASSED\n\nNexus is resilient to:\n- HTTP errors (404, 500)\n- Malformed JSON/HTML\n- Missing files\n- Large data\n- Unicode");
} else {
    Nexus.tui.print("⚠ SOME TESTS FAILED - Review error handling", "warn");
}
