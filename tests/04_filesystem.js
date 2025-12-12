// =====================================================
// 04_filesystem.js - File System Module Test
// Tests: Nexus.sys.save, Nexus.sys.load (Sandboxed)
// =====================================================

Nexus.tui.title("File System Test (Nexus.sys)");

var passed = 0;
var failed = 0;

// =====================================================
// TEST 1: Write a simple text file
// =====================================================
Nexus.tui.info("Test 1: Write text file");

var testContent = "Nexus Filesystem Test\nTimestamp: " + new Date().toISOString();
var testFile = "nexus_test.txt";

try {
    Nexus.sys.save(testFile, testContent);
    Nexus.tui.success("File written: " + testFile);
    passed++;
} catch (e) {
    Nexus.tui.error("Write failed: " + e);
    failed++;
}

// =====================================================
// TEST 2: Read the file back
// =====================================================
Nexus.tui.info("Test 2: Read text file");

try {
    var readContent = Nexus.sys.load(testFile);
    if (readContent === testContent) {
        Nexus.tui.success("File content matches exactly");
        passed++;
    } else if (readContent !== null) {
        Nexus.tui.error("Content mismatch!");
        Nexus.tui.print("Expected: " + testContent.substring(0, 50) + "...");
        Nexus.tui.print("Got: " + readContent.substring(0, 50) + "...");
        failed++;
    } else {
        Nexus.tui.error("Read returned null");
        failed++;
    }
} catch (e) {
    Nexus.tui.error("Read failed: " + e);
    failed++;
}

// =====================================================
// TEST 3: Write and read JSON
// =====================================================
Nexus.tui.info("Test 3: Write and read JSON file");

var testJSON = {
    name: "Nexus",
    version: "1.0",
    features: ["http", "dom", "tui", "sys"],
    timestamp: Date.now()
};
var jsonFile = "nexus_config_test.json";

try {
    Nexus.sys.save(jsonFile, JSON.stringify(testJSON, null, 2));
    Nexus.tui.success("JSON file written: " + jsonFile);
    
    var readJSON = Nexus.sys.load(jsonFile);
    var parsed = JSON.parse(readJSON);
    
    if (parsed.name === "Nexus" && parsed.features.length === 4) {
        Nexus.tui.success("JSON parsed correctly");
        passed++;
    } else {
        Nexus.tui.error("JSON data mismatch");
        failed++;
    }
} catch (e) {
    Nexus.tui.error("JSON test failed: " + e);
    failed++;
}

// =====================================================
// TEST 4: Read non-existent file (should return null)
// =====================================================
Nexus.tui.info("Test 4: Read non-existent file");

try {
    var missing = Nexus.sys.load("file_that_does_not_exist_12345.txt");
    if (missing === null) {
        Nexus.tui.success("Correctly returned null for missing file");
        passed++;
    } else {
        Nexus.tui.error("Should have returned null but got: " + missing);
        failed++;
    }
} catch (e) {
    // This is also acceptable behavior
    Nexus.tui.success("Threw exception for missing file (acceptable)");
    passed++;
}

// =====================================================
// TEST 5: Overwrite existing file
// =====================================================
Nexus.tui.info("Test 5: Overwrite existing file");

try {
    var newContent = "Overwritten content at " + new Date().toISOString();
    Nexus.sys.save(testFile, newContent);
    var readBack = Nexus.sys.load(testFile);
    
    if (readBack === newContent) {
        Nexus.tui.success("File overwrite successful");
        passed++;
    } else {
        Nexus.tui.error("Overwrite content mismatch");
        failed++;
    }
} catch (e) {
    Nexus.tui.error("Overwrite test failed: " + e);
    failed++;
}

// =====================================================
// SUMMARY
// =====================================================
Nexus.tui.markdown("---");
Nexus.tui.markdown("## Results");

var total = passed + failed;
Nexus.tui.table(
    ["Metric", "Value"],
    [
        ["Total Tests", total.toString()],
        ["Passed", passed.toString()],
        ["Failed", failed.toString()]
    ]
);

Nexus.tui.info("Files written to ~/.nexus/");

if (failed === 0) {
    Nexus.tui.box("✅ ALL FILESYSTEM TESTS PASSED");
} else {
    Nexus.tui.print("❌ SOME TESTS FAILED", "error");
}
