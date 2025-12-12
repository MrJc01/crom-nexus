// =====================================================
// run_all.js - Execute all tests in sequence
// =====================================================

Nexus.tui.title("NEXUS TEST SUITE");
Nexus.tui.markdown("Run individual tests with:");
Nexus.tui.print("  nexus run tests/01_net_check.js", "info");
Nexus.tui.print("  nexus run tests/02_dom_parser.js", "info");
Nexus.tui.print("  nexus run tests/03_visuals.js", "info");
Nexus.tui.print("  nexus run tests/04_filesystem.js", "info");
Nexus.tui.print("  nexus run tests/05_workflow_mock.js", "info");

Nexus.tui.markdown("---");

Nexus.tui.table(
    ["Test", "Description"],
    [
        ["01_net_check.js", "HTTP GET/POST/Headers"],
        ["02_dom_parser.js", "HTML parsing & CSS selectors"],
        ["03_visuals.js", "TUI rendering (table, markdown, box)"],
        ["04_filesystem.js", "File read/write operations"],
        ["05_workflow_mock.js", "Full workflow simulation"]
    ]
);
