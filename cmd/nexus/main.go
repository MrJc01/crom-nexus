package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/charmbracelet/lipgloss"
	"github.com/juanc/crom-nexus/internal/config"
	"github.com/juanc/crom-nexus/internal/registry"
	"github.com/juanc/crom-nexus/internal/runtime"
)

var (
	version = "2.0.0"

	outputFormat = "tui" // tui, json, md

	bannerStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#7D56F4")).
			Bold(true)

	subtitleStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#666666"))

	successStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#04B575"))

	errorStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#FF5F87"))

	infoStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#00D7FF"))
)

func main() {
	cfg, err := config.NewManager()
	if err != nil {
		fmt.Println(errorStyle.Render("Error initializing config: " + err.Error()))
		os.Exit(1)
	}

	args := parseArgs(os.Args[1:])

	if len(args) < 1 {
		printBanner()
		printHelp()
		return
	}

	firstArg := args[0]

	if strings.HasPrefix(firstArg, "@") {
		entityName := strings.TrimPrefix(firstArg, "@")
		command := ""
		entityArgs := []string{}

		if len(args) > 1 {
			command = args[1]
		}
		if len(args) > 2 {
			entityArgs = args[2:]
		}

		runEntity(cfg, entityName, command, entityArgs)
		return
	}

	switch firstArg {
	case "run":
		if len(args) < 2 {
			outputError("Usage: nexus run <script.js> [args...]")
			return
		}
		scriptArgs := []string{}
		if len(args) > 2 {
			scriptArgs = args[2:]
		}
		executeScript(cfg.ConfigDir, args[1], scriptArgs)

	case "exec":
		// Execute inline JavaScript
		if len(args) < 2 {
			outputError("Usage: nexus exec \"console.log('Hello')\"")
			return
		}
		code := strings.Join(args[1:], " ")
		executeInline(cfg.ConfigDir, code)

	case "fetch":
		// Quick fetch a URL and print response
		if len(args) < 2 {
			outputError("Usage: nexus fetch <url>")
			return
		}
		fetchURL(args[1])

	case "screenshot":
		// Save HTML snapshot of a page
		if len(args) < 2 {
			outputError("Usage: nexus screenshot <url> [filename]")
			return
		}
		filename := "screenshot.html"
		if len(args) > 2 {
			filename = args[2]
		}
		takeScreenshot(cfg.ConfigDir, args[1], filename)

	case "add":
		// Usage: nexus add @name <url/file>
		if len(args) < 3 {
			outputError("Usage: nexus add @name <url/file>")
			return
		}
		name := strings.TrimPrefix(args[1], "@")
		source := args[2]
		installEntity(cfg, name, source)

	case "install":
		// Usage: nexus install @name (uses registry)
		if len(args) < 2 {
			outputError("Usage: nexus install @name")
			return
		}
		name := strings.TrimPrefix(args[1], "@")
		installEntity(cfg, name, "auto")

	case "remove":
		if len(args) < 2 {
			outputError("Usage: nexus remove @name")
			return
		}
		name := strings.TrimPrefix(args[1], "@")
		cfg.RemoveEntity(name)
		outputSuccess("Entity @" + name + " removed.")

	case "list":
		listEntities(cfg)

	case "version":
		printBanner()

	case "help", "--help", "-h":
		printBanner()
		printHelp()

	default:
		outputError("Unknown command: " + firstArg)
		printHelp()
	}
}

// parseArgs processes args and extracts flags like --json
func parseArgs(args []string) []string {
	var result []string
	for _, arg := range args {
		switch arg {
		case "--json":
			outputFormat = "json"
		case "--md", "--markdown":
			outputFormat = "md"
		case "--html":
			outputFormat = "html"
		default:
			result = append(result, arg)
		}
	}
	return result
}

func outputError(msg string) {
	if outputFormat == "json" {
		jsonOut(map[string]interface{}{"error": msg})
	} else {
		fmt.Println(errorStyle.Render(msg))
	}
}

func outputSuccess(msg string) {
	if outputFormat == "json" {
		jsonOut(map[string]interface{}{"success": msg})
	} else {
		fmt.Println(successStyle.Render("✓ " + msg))
	}
}

func jsonOut(data interface{}) {
	b, _ := json.MarshalIndent(data, "", "  ")
	fmt.Println(string(b))
}

func printBanner() {
	if outputFormat != "tui" {
		return
	}
	banner := `
    _   __                    
   / | / /__  _  ____  _______
  /  |/ / _ \| |/_/ / / / ___/
 / /|  /  __/>  </ /_/ (__  ) 
/_/ |_/\___/_/|_|\__,_/____/  
`
	fmt.Println(bannerStyle.Render(banner))
	fmt.Println(subtitleStyle.Render("  The Terminal Runtime  |  v" + version))
	fmt.Println()
}

func printHelp() {
	fmt.Println(infoStyle.Render("Commands:"))
	fmt.Println("  nexus run <file.js>       Execute a local script")
	fmt.Println("  nexus exec \"code\"         Execute inline JavaScript")
	fmt.Println("  nexus fetch <url>         Quick fetch and display URL")
	fmt.Println("  nexus screenshot <url>    Save HTML snapshot")
	fmt.Println("  nexus @name [cmd] [args]  Run an installed entity")
	fmt.Println("  nexus install @name       Install entity from registry")
	fmt.Println("  nexus add @name <source>  Install from custom URL/File")
	fmt.Println("  nexus remove @name        Remove entity")
	fmt.Println("  nexus list                List installed entities")
	fmt.Println()
	fmt.Println(subtitleStyle.Render("Flags:"))
	fmt.Println("  --json    Output as JSON (for SDKs)")
	fmt.Println("  --md      Output as Markdown")
	fmt.Println()
	fmt.Println(subtitleStyle.Render("Examples:"))
	fmt.Println("  nexus run hello.js")
	fmt.Println("  nexus exec \"Nexus.tui.print('Hello!')\"")
	fmt.Println("  nexus fetch https://api.github.com/users/torvalds")
	fmt.Println("  nexus @google search \"golang\" --json")
	fmt.Println()
}

func listEntities(cfg *config.Manager) {
	if outputFormat == "json" {
		jsonOut(cfg.Config.Entities)
		return
	}

	if len(cfg.Config.Entities) == 0 {
		fmt.Println(subtitleStyle.Render("No entities installed."))
		fmt.Println(infoStyle.Render("Use 'nexus add @name <url>' to install one."))
		return
	}

	fmt.Println(infoStyle.Render("Installed Entities:"))
	for name, file := range cfg.Config.Entities {
		fmt.Printf("  @%s -> %s\n", name, file)
	}
}

func runEntity(cfg *config.Manager, name, command string, args []string) {
	path, ok := cfg.GetScriptPath(name)
	if !ok {
		outputError("Entity @" + name + " not found.")
		return
	}

	rt := runtime.NewRuntime(cfg.ConfigDir)
	rt.SetOutputFormat(outputFormat)
	err := rt.RunWithArgs(path, command, args)
	if err != nil {
		os.Exit(1)
	}
}

func installEntity(cfg *config.Manager, name, source string) {
	var content []byte
	var err error
	var installURL = source

	if outputFormat == "tui" {
		fmt.Println(infoStyle.Render("Installing @" + name + "..."))
	}

	// 1. Resolve URL if source is "registry" (keyword) or we want to force resolve
	// Actually, if the user does `nexus add @name` (no source), we assume registry.
	// But the current CLI usage is `nexus add @name <source>`.
	// We should change it: if <source> is "registry" OR empty (moved to registry default), strictly use registry.
	// However, to keep it simple: if source doesn't look like a URL or File, treat it as a registry lookup?
	// Or even better: Update the command usage.
	// The plan said: `nexus install @name`.
	// Let's defer that to the main switch case. For now, let's just make `installEntity` robust.
	// If the source is "auto" (magic keyword), we resolve it.

	if source == "auto" {
		url, err := registry.Resolve(name, "")
		if err != nil {
			outputError("Registry lookup failed: " + err.Error())
			return
		}
		installURL = url
		if outputFormat == "tui" {
			fmt.Println(subtitleStyle.Render("Resolved to: " + installURL))
		}
	}

	if strings.HasPrefix(installURL, "http://") || strings.HasPrefix(installURL, "https://") {
		resp, err := http.Get(installURL)
		if err != nil {
			outputError("Error downloading script: " + err.Error())
			return
		}
		defer resp.Body.Close()
		content, err = ioutil.ReadAll(resp.Body)
		if err != nil {
			outputError("Error reading response: " + err.Error())
			return
		}
	} else {
		content, err = ioutil.ReadFile(installURL)
		if err != nil {
			outputError("Error reading file: " + err.Error())
			return
		}
	}

	err = cfg.InstallScript(name, string(content))
	if err != nil {
		outputError("Error installing script: " + err.Error())
		return
	}

	outputSuccess("Entity @" + name + " installed successfully!")
}

func executeScript(configDir, path string, args []string) {
	rt := runtime.NewRuntime(configDir)
	rt.SetOutputFormat(outputFormat)

	if path == "-" {
		bytes, err := ioutil.ReadAll(os.Stdin)
		if err != nil {
			outputError("Error reading stdin: " + err.Error())
			return
		}
		// Inline execution doesn't easily support RunWithArgs unless we modify RunInline too,
		// but typically piped scripts hardcode values or don't use CLI args the same way.
		// However, to be consistent we could inject them. RunInline doesn't take args currently.
		// Let's stick to RunInline for stdin for now.
		err = rt.RunInline(string(bytes))
		if err != nil {
			os.Exit(1)
		}
		return
	}

	// Use RunWithArgs
	// Command name is the script filename
	cmdName := path
	err := rt.RunWithArgs(path, cmdName, args)
	if err != nil {
		os.Exit(1)
	}
}

func executeInline(configDir, code string) {
	rt := runtime.NewRuntime(configDir)
	rt.SetOutputFormat(outputFormat)
	err := rt.RunInline(code)
	if err != nil {
		os.Exit(1)
	}
}

func fetchURL(url string) {
	resp, err := http.Get(url)
	if err != nil {
		outputError("Fetch failed: " + err.Error())
		return
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)

	if outputFormat == "json" {
		// Try to parse as JSON, if fails return as string
		var data interface{}
		if json.Unmarshal(body, &data) == nil {
			jsonOut(data)
		} else {
			jsonOut(map[string]interface{}{
				"status": resp.StatusCode,
				"body":   string(body),
			})
		}
	} else {
		fmt.Println(string(body))
	}
}

func takeScreenshot(configDir, url, filename string) {
	resp, err := http.Get(url)
	if err != nil {
		outputError("Screenshot failed: " + err.Error())
		return
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)

	// Save to downloads folder
	path := configDir + "/downloads/" + filename
	os.MkdirAll(configDir+"/downloads", 0755)

	err = ioutil.WriteFile(path, body, 0644)
	if err != nil {
		outputError("Error saving screenshot: " + err.Error())
		return
	}

	outputSuccess("Screenshot saved to " + path)
}
