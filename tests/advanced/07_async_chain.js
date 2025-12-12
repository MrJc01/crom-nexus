// =====================================================
// 07_async_chain.js - Data Chaining & Loop Test
// Tests: Sequential API calls, data aggregation
// Note: Goja doesn't have native Promise/async support,
//       so we use synchronous patterns (which is fine for Nexus)
// =====================================================

Nexus.tui.title("Data Chain Test (API Aggregation)");

var passed = 0;
var failed = 0;
var startTime = Date.now();

// =====================================================
// STEP 1: Fetch list of users
// =====================================================
Nexus.tui.info("Step 1: Fetching user list from JSONPlaceholder");

var users = [];
try {
    var usersResponse = Nexus.http.get("https://jsonplaceholder.typicode.com/users");
    
    if (usersResponse.status === 200) {
        users = JSON.parse(usersResponse.body);
        Nexus.tui.success("Fetched " + users.length + " users");
        passed++;
    } else {
        Nexus.tui.error("Failed to fetch users: " + usersResponse.status);
        failed++;
    }
} catch (e) {
    Nexus.tui.error("Users request failed: " + e);
    failed++;
}

// =====================================================
// STEP 2: Get first 3 users
// =====================================================
Nexus.tui.info("Step 2: Processing first 3 users");

var targetUsers = users.slice(0, 3);
Nexus.tui.print("Selected: " + targetUsers.map(function(u) { return u.name; }).join(", "), "info");

// =====================================================
// STEP 3: Fetch posts for each user (sequential)
// =====================================================
Nexus.tui.info("Step 3: Fetching posts for each user");

var userStats = [];

for (var i = 0; i < targetUsers.length; i++) {
    var user = targetUsers[i];
    try {
        var postsUrl = "https://jsonplaceholder.typicode.com/posts?userId=" + user.id;
        var postsResponse = Nexus.http.get(postsUrl);
        
        if (postsResponse.status === 200) {
            var posts = JSON.parse(postsResponse.body);
            userStats.push({
                id: user.id,
                name: user.name,
                email: user.email,
                company: user.company.name,
                postCount: posts.length
            });
            Nexus.tui.success("User " + user.id + ": " + posts.length + " posts");
            passed++;
        } else {
            Nexus.tui.error("Failed for user " + user.id);
            failed++;
        }
    } catch (e) {
        Nexus.tui.error("Posts fetch error for user " + user.id + ": " + e);
        failed++;
    }
}

// =====================================================
// STEP 4: Display aggregated results
// =====================================================
Nexus.tui.info("Step 4: Aggregated Results");

var tableRows = userStats.map(function(u) {
    return [u.name, u.company, u.postCount.toString()];
});

Nexus.tui.table(
    ["User Name", "Company", "Posts"],
    tableRows
);

// Calculate totals
var totalPosts = userStats.reduce(function(sum, u) { return sum + u.postCount; }, 0);
var avgPosts = totalPosts / userStats.length;

Nexus.tui.markdown("### Statistics");
Nexus.tui.print("Total Posts: " + totalPosts, "info");
Nexus.tui.print("Average Posts/User: " + avgPosts.toFixed(1), "info");

// =====================================================
// STEP 5: Performance metrics
// =====================================================
var endTime = Date.now();
var duration = endTime - startTime;

Nexus.tui.markdown("---");
Nexus.tui.markdown("## Performance");

Nexus.tui.table(
    ["Metric", "Value"],
    [
        ["API Calls Made", "4"],
        ["Total Time", duration + "ms"],
        ["Avg per Call", (duration / 4).toFixed(0) + "ms"]
    ]
);

// =====================================================
// SUMMARY
// =====================================================
Nexus.tui.markdown("---");

if (failed === 0) {
    Nexus.tui.box("✅ DATA CHAIN TEST PASSED\n\nAll " + (passed) + " API calls successful.\nTotal execution: " + duration + "ms");
} else {
    Nexus.tui.print("❌ SOME TESTS FAILED (" + failed + " errors)", "error");
}
