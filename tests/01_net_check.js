// =====================================================
// 01_net_check.js - Network Module Test
// Tests: Nexus.http.get, Nexus.http.post, status codes
// =====================================================

Nexus.tui.title("Network Module Test (Nexus.http)");

var passed = 0;
var failed = 0;

// =====================================================
// TEST 1: HTTP GET Request
// =====================================================
Nexus.tui.info("Test 1: HTTP GET to httpbin.org/json");

try {
    var getResponse = Nexus.http.get("https://httpbin.org/json");
    
    if (getResponse.status === 200) {
        Nexus.tui.success("GET request returned status 200");
        passed++;
        
        // Check if body contains expected data
        if (getResponse.body.indexOf("slideshow") !== -1) {
            Nexus.tui.success("Response body contains expected JSON data");
            passed++;
        } else {
            Nexus.tui.error("Response body missing expected content");
            failed++;
        }
    } else {
        Nexus.tui.error("GET failed with status: " + getResponse.status);
        failed++;
    }
} catch (e) {
    Nexus.tui.error("GET request threw exception: " + e);
    failed++;
}

// =====================================================
// TEST 2: HTTP POST Request
// =====================================================
Nexus.tui.info("Test 2: HTTP POST to httpbin.org/post");

try {
    var postData = JSON.stringify({ teste: "nexus", version: "1.0" });
    var postResponse = Nexus.http.post("https://httpbin.org/post", postData);
    
    if (postResponse.status === 200) {
        Nexus.tui.success("POST request returned status 200");
        passed++;
        
        // httpbin echoes the data back
        if (postResponse.body.indexOf("nexus") !== -1) {
            Nexus.tui.success("POST data was received correctly by server");
            passed++;
        } else {
            Nexus.tui.error("POST data not found in response");
            failed++;
        }
    } else {
        Nexus.tui.error("POST failed with status: " + postResponse.status);
        failed++;
    }
} catch (e) {
    Nexus.tui.error("POST request threw exception: " + e);
    failed++;
}

// =====================================================
// TEST 3: Request with custom options
// =====================================================
Nexus.tui.info("Test 3: Custom Headers via request()");

try {
    var customResponse = Nexus.http.request({
        method: "GET",
        url: "https://httpbin.org/headers",
        headers: {
            "X-Nexus-Test": "CustomHeader"
        }
    });
    
    if (customResponse.status === 200 && customResponse.body.indexOf("X-Nexus-Test") !== -1) {
        Nexus.tui.success("Custom header was sent and echoed back");
        passed++;
    } else {
        Nexus.tui.error("Custom header not found in response");
        failed++;
    }
} catch (e) {
    Nexus.tui.error("Custom request threw exception: " + e);
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

if (failed === 0) {
    Nexus.tui.box("✅ ALL NETWORK TESTS PASSED");
} else {
    Nexus.tui.print("❌ SOME TESTS FAILED", "error");
}
