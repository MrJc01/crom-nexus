package api

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/charmbracelet/glamour"
	"github.com/charmbracelet/lipgloss"
	"github.com/dop251/goja"
	"golang.org/x/term"
)

// TUIModule provides rich terminal UI capabilities
type TUIModule struct {
	vm *goja.Runtime
}

func NewTUIModule() *TUIModule {
	return &TUIModule{}
}

// Styles using Lipgloss
var (
	titleStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(lipgloss.Color("#7D56F4")).
			MarginBottom(1)

	successStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#04B575"))

	errorStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#FF5F87")).
			Bold(true)

	infoStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#00D7FF"))

	warnStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#FFCC00"))

	promptStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#7D56F4")).
			Bold(true)

	tableHeaderStyle = lipgloss.NewStyle().
				Bold(true).
				Foreground(lipgloss.Color("#FAFAFA")).
				Background(lipgloss.Color("#7D56F4")).
				Padding(0, 1)

	tableCellStyle = lipgloss.NewStyle().
			Padding(0, 1)

	borderStyle = lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(lipgloss.Color("#7D56F4")).
			Padding(1, 2)

	selectedStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#7D56F4")).
			Bold(true)
)

func (t *TUIModule) Register(vm *goja.Runtime, nexus *goja.Object) {
	t.vm = vm
	tuiObj := vm.NewObject()
	nexus.Set("tui", tuiObj)

	tuiObj.Set("print", t.print)
	tuiObj.Set("table", t.table)
	tuiObj.Set("markdown", t.markdown)
	tuiObj.Set("title", t.title)
	tuiObj.Set("success", t.success)
	tuiObj.Set("error", t.printError)
	tuiObj.Set("info", t.info)
	tuiObj.Set("warn", t.warn)
	tuiObj.Set("box", t.box)
	tuiObj.Set("input", t.input)
	tuiObj.Set("list", t.list)
	tuiObj.Set("confirm", t.confirm)
}

// print renders text with optional color
func (t *TUIModule) print(call goja.FunctionCall) goja.Value {
	text := call.Argument(0).String()
	color := ""
	if len(call.Arguments) > 1 {
		color = call.Argument(1).String()
	}

	var styled string
	switch color {
	case "green", "success":
		styled = successStyle.Render(text)
	case "red", "error":
		styled = errorStyle.Render(text)
	case "blue", "info":
		styled = infoStyle.Render(text)
	case "yellow", "warn":
		styled = warnStyle.Render(text)
	case "purple", "title":
		styled = titleStyle.Render(text)
	default:
		styled = text
	}

	fmt.Println(styled)
	return goja.Undefined()
}

// title renders a styled title
func (t *TUIModule) title(call goja.FunctionCall) goja.Value {
	text := call.Argument(0).String()
	fmt.Println(titleStyle.Render("🚀 " + text))
	return goja.Undefined()
}

// success renders green success message
func (t *TUIModule) success(call goja.FunctionCall) goja.Value {
	text := call.Argument(0).String()
	fmt.Println(successStyle.Render("✓ " + text))
	return goja.Undefined()
}

// printError renders red error message
func (t *TUIModule) printError(call goja.FunctionCall) goja.Value {
	text := call.Argument(0).String()
	fmt.Println(errorStyle.Render("✗ " + text))
	return goja.Undefined()
}

// info renders blue info message
func (t *TUIModule) info(call goja.FunctionCall) goja.Value {
	text := call.Argument(0).String()
	fmt.Println(infoStyle.Render("ℹ " + text))
	return goja.Undefined()
}

// warn renders yellow warning message
func (t *TUIModule) warn(call goja.FunctionCall) goja.Value {
	text := call.Argument(0).String()
	fmt.Println(warnStyle.Render("⚠ " + text))
	return goja.Undefined()
}

// box renders text in a styled box
func (t *TUIModule) box(call goja.FunctionCall) goja.Value {
	text := call.Argument(0).String()
	fmt.Println(borderStyle.Render(text))
	return goja.Undefined()
}

// input prompts user for text input (blocking)
func (t *TUIModule) input(call goja.FunctionCall) goja.Value {
	prompt := call.Argument(0).String()

	// Check for options (mask: true for passwords)
	mask := false
	if len(call.Arguments) > 1 {
		opts := call.Argument(1).Export()
		if optsMap, ok := opts.(map[string]interface{}); ok {
			if m, exists := optsMap["mask"]; exists {
				mask, _ = m.(bool)
			}
		}
	}

	fmt.Print(promptStyle.Render(prompt + " "))

	var input string
	if mask {
		// Password input (hidden)
		bytePwd, err := term.ReadPassword(int(os.Stdin.Fd()))
		fmt.Println() // newline after password
		if err != nil {
			return t.vm.ToValue("")
		}
		input = string(bytePwd)
	} else {
		// Regular text input
		reader := bufio.NewReader(os.Stdin)
		line, err := reader.ReadString('\n')
		if err != nil {
			return t.vm.ToValue("")
		}
		input = strings.TrimSpace(line)
	}

	return t.vm.ToValue(input)
}

// list shows a selection menu and returns the selected item
func (t *TUIModule) list(call goja.FunctionCall) goja.Value {
	promptArg := call.Argument(0)
	itemsArg := call.Argument(1)

	// Handle: list("prompt", items) or list(items)
	var prompt string
	var itemsInterface interface{}

	if itemsArg == nil || itemsArg.Equals(goja.Undefined()) {
		// Single argument: list(items)
		prompt = "Select an option:"
		itemsInterface = promptArg.Export()
	} else {
		// Two arguments: list("prompt", items)
		prompt = promptArg.String()
		itemsInterface = itemsArg.Export()
	}

	items, ok := itemsInterface.([]interface{})
	if !ok {
		fmt.Println(errorStyle.Render("List error: items must be an array"))
		return goja.Null()
	}

	fmt.Println(promptStyle.Render("\n" + prompt))
	fmt.Println()

	for i, item := range items {
		fmt.Printf("  %s %s\n",
			selectedStyle.Render(fmt.Sprintf("[%d]", i+1)),
			fmt.Sprintf("%v", item))
	}

	fmt.Println()
	fmt.Print(promptStyle.Render("Enter number: "))

	reader := bufio.NewReader(os.Stdin)
	line, err := reader.ReadString('\n')
	if err != nil {
		return goja.Null()
	}

	choice, err := strconv.Atoi(strings.TrimSpace(line))
	if err != nil || choice < 1 || choice > len(items) {
		fmt.Println(errorStyle.Render("Invalid selection"))
		return goja.Null()
	}

	// Return the selected item
	return t.vm.ToValue(items[choice-1])
}

// confirm shows a yes/no prompt
func (t *TUIModule) confirm(call goja.FunctionCall) goja.Value {
	prompt := call.Argument(0).String()

	fmt.Print(promptStyle.Render(prompt + " [y/n] "))

	reader := bufio.NewReader(os.Stdin)
	line, err := reader.ReadString('\n')
	if err != nil {
		return t.vm.ToValue(false)
	}

	answer := strings.ToLower(strings.TrimSpace(line))
	return t.vm.ToValue(answer == "y" || answer == "yes" || answer == "s" || answer == "sim")
}

// table renders a beautiful ASCII table
func (t *TUIModule) table(call goja.FunctionCall) goja.Value {
	headersArg := call.Argument(0).Export()
	rowsArg := call.Argument(1).Export()

	headers, ok := headersArg.([]interface{})
	if !ok {
		fmt.Println(errorStyle.Render("Table error: headers must be an array"))
		return goja.Undefined()
	}

	rows, ok := rowsArg.([]interface{})
	if !ok {
		fmt.Println(errorStyle.Render("Table error: rows must be an array"))
		return goja.Undefined()
	}

	// Calculate column widths
	colWidths := make([]int, len(headers))
	for i, h := range headers {
		colWidths[i] = len(fmt.Sprintf("%v", h))
	}

	for _, row := range rows {
		if rowSlice, ok := row.([]interface{}); ok {
			for i, cell := range rowSlice {
				if i < len(colWidths) {
					cellLen := len(fmt.Sprintf("%v", cell))
					if cellLen > colWidths[i] {
						colWidths[i] = cellLen
					}
				}
			}
		}
	}

	// Build table
	var sb strings.Builder

	// Header
	sb.WriteString("┌")
	for i, w := range colWidths {
		sb.WriteString(strings.Repeat("─", w+2))
		if i < len(colWidths)-1 {
			sb.WriteString("┬")
		}
	}
	sb.WriteString("┐\n")

	// Header row
	sb.WriteString("│")
	for i, h := range headers {
		cell := fmt.Sprintf("%v", h)
		padding := colWidths[i] - len(cell)
		sb.WriteString(" ")
		sb.WriteString(cell)
		sb.WriteString(strings.Repeat(" ", padding+1))
		sb.WriteString("│")
	}
	sb.WriteString("\n")

	// Header separator
	sb.WriteString("├")
	for i, w := range colWidths {
		sb.WriteString(strings.Repeat("─", w+2))
		if i < len(colWidths)-1 {
			sb.WriteString("┼")
		}
	}
	sb.WriteString("┤\n")

	// Data rows
	for _, row := range rows {
		if rowSlice, ok := row.([]interface{}); ok {
			sb.WriteString("│")
			for i := 0; i < len(colWidths); i++ {
				var cell string
				if i < len(rowSlice) {
					cell = fmt.Sprintf("%v", rowSlice[i])
				}
				padding := colWidths[i] - len(cell)
				sb.WriteString(" ")
				sb.WriteString(cell)
				sb.WriteString(strings.Repeat(" ", padding+1))
				sb.WriteString("│")
			}
			sb.WriteString("\n")
		}
	}

	// Footer
	sb.WriteString("└")
	for i, w := range colWidths {
		sb.WriteString(strings.Repeat("─", w+2))
		if i < len(colWidths)-1 {
			sb.WriteString("┴")
		}
	}
	sb.WriteString("┘")

	// Apply purple border color
	tableStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#7D56F4"))
	fmt.Println(tableStyle.Render(sb.String()))

	return goja.Undefined()
}

// markdown renders markdown text with glamour
func (t *TUIModule) markdown(call goja.FunctionCall) goja.Value {
	text := call.Argument(0).String()

	renderer, err := glamour.NewTermRenderer(
		glamour.WithAutoStyle(),
		glamour.WithWordWrap(80),
	)
	if err != nil {
		fmt.Println(text) // Fallback to plain text
		return goja.Undefined()
	}

	out, err := renderer.Render(text)
	if err != nil {
		fmt.Println(text)
		return goja.Undefined()
	}

	fmt.Print(out)
	return goja.Undefined()
}
