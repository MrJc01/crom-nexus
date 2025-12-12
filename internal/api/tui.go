package api

import (
	"fmt"
	"strings"

	"github.com/charmbracelet/glamour"
	"github.com/charmbracelet/lipgloss"
	"github.com/dop251/goja"
)

// TUIModule provides rich terminal UI capabilities
type TUIModule struct{}

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
)

func (t *TUIModule) Register(vm *goja.Runtime, nexus *goja.Object) {
	tuiObj := vm.NewObject()
	nexus.Set("tui", tuiObj)

	tuiObj.Set("print", t.print)
	tuiObj.Set("table", t.table)
	tuiObj.Set("markdown", t.markdown)
	tuiObj.Set("title", t.title)
	tuiObj.Set("success", t.success)
	tuiObj.Set("error", t.printError)
	tuiObj.Set("info", t.info)
	tuiObj.Set("box", t.box)
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

// box renders text in a styled box
func (t *TUIModule) box(call goja.FunctionCall) goja.Value {
	text := call.Argument(0).String()
	fmt.Println(borderStyle.Render(text))
	return goja.Undefined()
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
