// =====================================================
// 09_interactive_form.js - User Input Wizard Test
// Tests: Nexus.tui.input, Nexus.tui.list, Nexus.tui.confirm
// =====================================================

Nexus.tui.title("Interactive Form Test (User Input)");

Nexus.tui.markdown("This test will ask for user input to verify the TUI input system.\n");

// =====================================================
// STEP 1: Text Input
// =====================================================
Nexus.tui.info("Step 1: Basic Text Input");

var userName = Nexus.tui.input("What is your name?");
Nexus.tui.success("Hello, " + userName + "!");

// =====================================================
// STEP 2: Password Input (Masked)
// =====================================================
Nexus.tui.info("Step 2: Password Input (characters hidden)");

var password = Nexus.tui.input("Enter a test password:", { mask: true });
Nexus.tui.success("Password received (" + password.length + " characters)");

// =====================================================
// STEP 3: Selection List
// =====================================================
Nexus.tui.info("Step 3: Selection List");

var servers = ["Production (US-East)", "Staging (EU-West)", "Development (Local)"];
var selectedServer = Nexus.tui.list("Select a server:", servers);

if (selectedServer !== null) {
    Nexus.tui.success("Selected: " + selectedServer);
} else {
    Nexus.tui.warn("No selection made");
}

// =====================================================
// STEP 4: Confirmation
// =====================================================
Nexus.tui.info("Step 4: Confirmation Prompt");

var confirmed = Nexus.tui.confirm("Do you want to save this configuration?");

if (confirmed) {
    Nexus.tui.success("Configuration confirmed!");
} else {
    Nexus.tui.warn("Configuration cancelled");
}

// =====================================================
// STEP 5: Display collected data
// =====================================================
Nexus.tui.markdown("---");
Nexus.tui.markdown("## Configuration Summary");

var configData = {
    user: userName || "(not provided)",
    passwordLength: password ? password.length : 0,
    server: selectedServer || "(not selected)",
    confirmed: confirmed
};

Nexus.tui.table(
    ["Setting", "Value"],
    [
        ["Username", configData.user],
        ["Password Length", configData.passwordLength.toString() + " chars"],
        ["Server", configData.server],
        ["Confirmed", configData.confirmed ? "Yes" : "No"]
    ]
);

// Save configuration
var configJSON = JSON.stringify(configData, null, 2);
Nexus.sys.save("user_config.json", configJSON);

Nexus.tui.success("Configuration saved to ~/.nexus/user_config.json");

// =====================================================
// Final Report
// =====================================================
var reportMD = `
## Interactive Test Complete

**User:** ${configData.user}  
**Server:** ${configData.server}  
**Status:** ${configData.confirmed ? "✅ Saved" : "❌ Cancelled"}
`;

Nexus.tui.markdown(reportMD);

Nexus.tui.box("✅ INTERACTIVE FORM TEST COMPLETE\n\nAll input methods working:\n- Text input\n- Password (masked)\n- Selection list\n- Confirmation");
