// =====================================================
// 06_auth_flow.js - Cookie Persistence Test
// Tests: CookieJar functionality between requests
// =====================================================

Nexus.tui.title("Authentication Flow Test (Cookie Persistence)");

var passed = 0;
var failed = 0;

// =====================================================
// TEST 1: Set cookie via httpbin
// =====================================================
Nexus.tui.info("Test 1: Setting session cookie");

try {
    // This endpoint sets a cookie
    var setResponse = Nexus.http.get("https://httpbin.org/cookies/set?nexus_session=admin123");
    
    if (setResponse.status === 200) {
        Nexus.tui.success("Cookie set request completed (status: " + setResponse.status + ")");
        passed++;
    } else {
        Nexus.tui.error("Unexpected status: " + setResponse.status);
        failed++;
    }
} catch (e) {
    Nexus.tui.error("Cookie set failed: " + e);
    failed++;
}

// =====================================================
// TEST 2: Verify cookie was stored and sent back
// =====================================================
Nexus.tui.info("Test 2: Verifying cookie persistence");

try {
    // This endpoint echoes back all cookies the client sent
    var cookieResponse = Nexus.http.get("https://httpbin.org/cookies");
    
    if (cookieResponse.status === 200) {
        var body = cookieResponse.body;
        
        // Check if our cookie is in the response
        if (body.indexOf("nexus_session") !== -1 && body.indexOf("admin123") !== -1) {
            Nexus.tui.success("CookieJar is working! Session persisted correctly.");
            passed++;
            
            // Parse and display the cookies
            try {
                var data = JSON.parse(body);
                Nexus.tui.print("Cookies received by server: " + JSON.stringify(data.cookies), "info");
            } catch (e) {
                // JSON parse failed, but cookie test passed
            }
        } else {
            Nexus.tui.error("Cookie not found in response. CookieJar may not be working.");
            Nexus.tui.print("Response body: " + body.substring(0, 200), "warn");
            failed++;
        }
    } else {
        Nexus.tui.error("Cookie check failed with status: " + cookieResponse.status);
        failed++;
    }
} catch (e) {
    Nexus.tui.error("Cookie verification threw exception: " + e);
    failed++;
}

// =====================================================
// TEST 3: Multiple cookies
// =====================================================
Nexus.tui.info("Test 3: Setting multiple cookies");

try {
    Nexus.http.get("https://httpbin.org/cookies/set?user_id=42");
    Nexus.http.get("https://httpbin.org/cookies/set?lang=pt-BR");
    
    var multiResponse = Nexus.http.get("https://httpbin.org/cookies");
    var multiBody = multiResponse.body;
    
    var hasUserId = multiBody.indexOf("user_id") !== -1;
    var hasLang = multiBody.indexOf("lang") !== -1;
    var hasSession = multiBody.indexOf("nexus_session") !== -1;
    
    if (hasUserId && hasLang && hasSession) {
        Nexus.tui.success("Multiple cookies persisted correctly (3 cookies)");
        passed++;
    } else {
        Nexus.tui.warn("Some cookies missing. Found: session=" + hasSession + ", user_id=" + hasUserId + ", lang=" + hasLang);
        failed++;
    }
} catch (e) {
    Nexus.tui.error("Multiple cookie test failed: " + e);
    failed++;
}

// =====================================================
// SUMMARY
// =====================================================
Nexus.tui.markdown("---");
Nexus.tui.markdown("## Authentication Test Results");

Nexus.tui.table(
    ["Metric", "Value"],
    [
        ["Total Tests", (passed + failed).toString()],
        ["Passed", passed.toString()],
        ["Failed", failed.toString()]
    ]
);

if (failed === 0) {
    Nexus.tui.box("✅ ALL AUTH TESTS PASSED\n\nCookieJar is functioning correctly.\nSessions will persist across requests.");
} else {
    Nexus.tui.print("❌ SOME TESTS FAILED - Check CookieJar implementation", "error");
}
