package runtime

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"time"

	"github.com/charmbracelet/lipgloss"
	"github.com/dop251/goja"
	"github.com/juanc/crom-nexus/internal/api"
)

// Styles for error output
var (
	errorTitleStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(lipgloss.Color("#FF5F87")).
			Background(lipgloss.Color("#3C3C3C")).
			Padding(0, 1)

	errorMsgStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#FAFAFA")).
			MarginLeft(2)

	successStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#04B575"))
)

// Runtime wraps the Javascript VM with all Nexus capabilities
type Runtime struct {
	vm           *goja.Runtime
	configDir    string
	outputFormat string
	httpMod      *api.HTTPModule
	domMod       *api.DOMModule
	sysMod       *api.SysModule
	tuiMod       *api.TUIModule
	secureMod    *api.SecureModule
}

// NewRuntime creates a new Nexus Javascript Runtime
func NewRuntime(configDir string) *Runtime {
	vm := goja.New()
	vm.SetFieldNameMapper(goja.TagFieldNameMapper("json", true))

	r := &Runtime{
		vm:           vm,
		configDir:    configDir,
		outputFormat: "tui",
		httpMod:      api.NewHTTPModule(),
		domMod:       api.NewDOMModule(),
		sysMod:       api.NewSysModule(configDir),
		tuiMod:       api.NewTUIModule(),
		secureMod:    api.NewSecureModule(configDir),
	}

	r.registerGlobals()
	r.loadHelperLibrary()
	return r
}

// SetOutputFormat sets the output format (tui, json, md)
func (r *Runtime) SetOutputFormat(format string) {
	r.outputFormat = format
}

// registerGlobals injects the Nexus API into the VM
func (r *Runtime) registerGlobals() {
	// Create the main "Nexus" object
	nexusObj := r.vm.NewObject()
	r.vm.Set("Nexus", nexusObj)

	// Register all Standard Library modules
	r.httpMod.Register(r.vm, nexusObj)
	r.domMod.Register(r.vm, nexusObj)
	r.sysMod.Register(r.vm, nexusObj)
	r.tuiMod.Register(r.vm, nexusObj)
	r.secureMod.Register(r.vm, nexusObj)

	// Add console.log for convenience
	console := r.vm.NewObject()
	console.Set("log", func(call goja.FunctionCall) goja.Value {
		for _, arg := range call.Arguments {
			fmt.Print(arg.String(), " ")
		}
		fmt.Println()
		return goja.Undefined()
	})
	r.vm.Set("console", console)
}

// loadHelperLibrary loads the nx.js helper library if available
func (r *Runtime) loadHelperLibrary() {
	// Try to find nx.js in multiple locations
	locations := []string{
		filepath.Join(r.configDir, "lib", "nx.js"),
		"nexus-scripts/lib/nx.js",
		"lib/nx.js",
	}

	for _, path := range locations {
		if content, err := ioutil.ReadFile(path); err == nil {
			r.vm.RunScript("nx.js", string(content))
			return
		}
	}
}

// Run executes a Javascript script with full error handling
func (r *Runtime) Run(scriptPath string) error {
	startTime := time.Now()

	defer func() {
		if err := recover(); err != nil {
			r.printError("Runtime Panic", fmt.Sprintf("%v", err))
		}
	}()

	script, err := ioutil.ReadFile(scriptPath)
	if err != nil {
		r.printError("File Error", fmt.Sprintf("Could not read '%s': %v", scriptPath, err))
		return err
	}

	_, err = r.vm.RunScript(scriptPath, string(script))
	if err != nil {
		if exception, ok := err.(*goja.Exception); ok {
			r.printError("Script Error", exception.String())
		} else {
			r.printError("Execution Error", err.Error())
		}
		return err
	}

	elapsed := time.Since(startTime)
	if r.outputFormat == "tui" {
		fmt.Println(successStyle.Render(fmt.Sprintf("\n✓ Script completed in %v", elapsed.Round(time.Millisecond))))
	}

	return nil
}

// RunInline executes inline JavaScript code
func (r *Runtime) RunInline(code string) error {
	startTime := time.Now()

	defer func() {
		if err := recover(); err != nil {
			r.printError("Runtime Panic", fmt.Sprintf("%v", err))
		}
	}()

	result, err := r.vm.RunScript("inline", code)
	if err != nil {
		if exception, ok := err.(*goja.Exception); ok {
			r.printError("Script Error", exception.String())
		} else {
			r.printError("Execution Error", err.Error())
		}
		return err
	}

	elapsed := time.Since(startTime)

	if r.outputFormat == "json" {
		output := map[string]interface{}{
			"result": result.Export(),
			"time":   elapsed.Milliseconds(),
		}
		b, _ := json.MarshalIndent(output, "", "  ")
		fmt.Println(string(b))
	} else if r.outputFormat == "tui" {
		// Print result if not undefined
		if result != goja.Undefined() && result != goja.Null() {
			fmt.Println(result.String())
		}
		fmt.Println(successStyle.Render(fmt.Sprintf("✓ Completed in %v", elapsed.Round(time.Millisecond))))
	}

	return nil
}

// RunWithArgs executes a script and injects arguments into the JS context
func (r *Runtime) RunWithArgs(scriptPath string, command string, args []string) error {
	// Inject command and args into the VM
	allArgs := append([]string{command}, args...)
	r.vm.Set("__command__", command)
	r.vm.Set("__args__", allArgs)

	return r.Run(scriptPath)
}

// printError displays a formatted error message
func (r *Runtime) printError(title, message string) {
	if r.outputFormat == "json" {
		output := map[string]interface{}{
			"error":   title,
			"message": message,
		}
		b, _ := json.MarshalIndent(output, "", "  ")
		fmt.Fprintln(os.Stderr, string(b))
	} else {
		fmt.Fprintln(os.Stderr, "")
		fmt.Fprintln(os.Stderr, errorTitleStyle.Render("❌ "+title))
		fmt.Fprintln(os.Stderr, errorMsgStyle.Render(message))
		fmt.Fprintln(os.Stderr, "")
	}
}
