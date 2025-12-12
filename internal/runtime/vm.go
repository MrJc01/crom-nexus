package runtime

import (
	"fmt"
	"io/ioutil"
	"os"
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
	vm        *goja.Runtime
	configDir string
	httpMod   *api.HTTPModule
	domMod    *api.DOMModule
	sysMod    *api.SysModule
	tuiMod    *api.TUIModule
}

// NewRuntime creates a new Nexus Javascript Runtime
func NewRuntime(configDir string) *Runtime {
	vm := goja.New()
	vm.SetFieldNameMapper(goja.TagFieldNameMapper("json", true))

	r := &Runtime{
		vm:        vm,
		configDir: configDir,
		httpMod:   api.NewHTTPModule(),
		domMod:    api.NewDOMModule(),
		sysMod:    api.NewSysModule(configDir),
		tuiMod:    api.NewTUIModule(),
	}

	r.registerGlobals()
	return r
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

// Run executes a Javascript script with full error handling
func (r *Runtime) Run(scriptPath string) error {
	startTime := time.Now()

	// Panic Recovery - catch any Go panics from the VM
	defer func() {
		if err := recover(); err != nil {
			r.printError("Runtime Panic", fmt.Sprintf("%v", err))
		}
	}()

	// Read the script file
	script, err := ioutil.ReadFile(scriptPath)
	if err != nil {
		r.printError("File Error", fmt.Sprintf("Could not read '%s': %v", scriptPath, err))
		return err
	}

	// Execute the script
	_, err = r.vm.RunScript(scriptPath, string(script))
	if err != nil {
		// Handle JS exceptions gracefully
		if exception, ok := err.(*goja.Exception); ok {
			r.printError("Script Error", exception.String())
		} else {
			r.printError("Execution Error", err.Error())
		}
		return err
	}

	elapsed := time.Since(startTime)
	fmt.Println(successStyle.Render(fmt.Sprintf("\n✓ Script completed in %v", elapsed.Round(time.Millisecond))))

	return nil
}

// RunWithArgs executes a script and injects arguments into the JS context
func (r *Runtime) RunWithArgs(scriptPath string, command string, args []string) error {
	// Inject command and args into the VM
	r.vm.Set("__command__", command)
	r.vm.Set("__args__", args)

	return r.Run(scriptPath)
}

// printError displays a formatted error message
func (r *Runtime) printError(title, message string) {
	fmt.Fprintln(os.Stderr, "")
	fmt.Fprintln(os.Stderr, errorTitleStyle.Render("❌ "+title))
	fmt.Fprintln(os.Stderr, errorMsgStyle.Render(message))
	fmt.Fprintln(os.Stderr, "")
}
