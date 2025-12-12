// =====================================================
// 03_visuals.js - TUI Visual Rendering Test
// Tests: Nexus.tui (print, markdown, table, box)
// =====================================================

Nexus.tui.title("TUI Visual Rendering Test (Nexus.tui)");

// =====================================================
// TEST 1: Print with different colors
// =====================================================
Nexus.tui.markdown("## 1. Color Output Test");

Nexus.tui.print("Default text (no color)");
Nexus.tui.print("This is SUCCESS (green)", "success");
Nexus.tui.print("This is ERROR (red)", "error");
Nexus.tui.print("This is INFO (blue)", "info");
Nexus.tui.print("This is TITLE (purple)", "title");

// =====================================================
// TEST 2: Styled messages
// =====================================================
Nexus.tui.markdown("## 2. Styled Messages");

Nexus.tui.success("This is a success message with icon");
Nexus.tui.error("This is an error message with icon");
Nexus.tui.info("This is an info message with icon");
Nexus.tui.title("This is a title");

// =====================================================
// TEST 3: Markdown Rendering
// =====================================================
Nexus.tui.markdown("## 3. Markdown Rendering");

var mdContent = `
# Heading 1
## Heading 2

This is **bold** and this is *italic*.

> This is a blockquote

- Item 1
- Item 2
- Item 3

\`inline code\` example

---
`;

Nexus.tui.markdown(mdContent);

// =====================================================
// TEST 4: Table Rendering
// =====================================================
Nexus.tui.markdown("## 4. Table Rendering");

// Simple table
Nexus.tui.info("Simple Table:");
Nexus.tui.table(
    ["Name", "Role"],
    [
        ["Alice", "Developer"],
        ["Bob", "Designer"],
        ["Charlie", "Manager"]
    ]
);

// Complex table with more columns
Nexus.tui.info("Server Status Table:");
Nexus.tui.table(
    ["Server", "IP Address", "Status", "Uptime"],
    [
        ["web-01", "192.168.1.10", "Online", "99.9%"],
        ["db-01", "192.168.1.20", "Online", "99.5%"],
        ["cache-01", "192.168.1.30", "Warning", "95.2%"],
        ["backup-01", "192.168.1.40", "Offline", "0%"]
    ]
);

// =====================================================
// TEST 5: Box Rendering
// =====================================================
Nexus.tui.markdown("## 5. Box Rendering");

Nexus.tui.box("This is text inside a styled box!");
Nexus.tui.box("Multi-line box:\n- Line 1\n- Line 2\n- Line 3");

// =====================================================
// SUMMARY
// =====================================================
Nexus.tui.markdown("---");
Nexus.tui.box("✅ VISUAL TEST COMPLETE\n\nIf you can read this properly formatted,\nall TUI components are working!");
