package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/charmbracelet/lipgloss"
	"github.com/juanc/crom-nexus/internal/config"
	"github.com/juanc/crom-nexus/internal/runtime"
)

var (
	version = "1.0.0"

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

	if len(os.Args) < 2 {
		printBanner()
		printHelp()
		return
	}

	// Parse: nexus @entity command args...
	firstArg := os.Args[1]

	if strings.HasPrefix(firstArg, "@") {
		entityName := strings.TrimPrefix(firstArg, "@")
		command := ""
		args := []string{}

		if len(os.Args) > 2 {
			command = os.Args[2]
		}
		if len(os.Args) > 3 {
			args = os.Args[3:]
		}

		runEntity(cfg, entityName, command, args)
		return
	}

	switch firstArg {
	case "run":
		if len(os.Args) < 3 {
			fmt.Println(errorStyle.Render("Usage: nexus run <script.js>"))
			return
		}
		scriptPath := os.Args[2]
		executeScript(cfg.ConfigDir, scriptPath)

	case "add":
		if len(os.Args) < 4 {
			fmt.Println(errorStyle.Render("Usage: nexus add @name <url/file>"))
			return
		}
		name := strings.TrimPrefix(os.Args[2], "@")
		source := os.Args[3]
		installEntity(cfg, name, source)

	case "remove":
		if len(os.Args) < 3 {
			fmt.Println(errorStyle.Render("Usage: nexus remove @name"))
			return
		}
		name := strings.TrimPrefix(os.Args[2], "@")
		cfg.RemoveEntity(name)
		fmt.Println(successStyle.Render("✓ Entity @" + name + " removed."))

	case "list":
		listEntities(cfg)

	case "version":
		printBanner()

	case "help", "--help", "-h":
		printBanner()
		printHelp()

	default:
		fmt.Println(errorStyle.Render("Unknown command: " + firstArg))
		printHelp()
	}
}

func printBanner() {
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
	fmt.Println("  nexus run <file.js>      Execute a local script")
	fmt.Println("  nexus @name [cmd] [args] Run an installed entity")
	fmt.Println("  nexus add @name <source> Install a new entity from URL or file")
	fmt.Println("  nexus remove @name       Remove an installed entity")
	fmt.Println("  nexus list               List all installed entities")
	fmt.Println("  nexus version            Show version")
	fmt.Println()
	fmt.Println(subtitleStyle.Render("Examples:"))
	fmt.Println("  nexus run hello.js")
	fmt.Println("  nexus add @google https://example.com/google.nx.js")
	fmt.Println("  nexus @google search \"golang tutorial\"")
	fmt.Println()
}

func listEntities(cfg *config.Manager) {
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
		fmt.Println(errorStyle.Render("Entity @" + name + " not found."))
		fmt.Println(subtitleStyle.Render("Use 'nexus list' to see installed entities."))
		return
	}

	rt := runtime.NewRuntime(cfg.ConfigDir)
	err := rt.RunWithArgs(path, command, args)
	if err != nil {
		os.Exit(1)
	}
}

func installEntity(cfg *config.Manager, name, source string) {
	var content []byte
	var err error

	fmt.Println(infoStyle.Render("Installing @" + name + "..."))

	if strings.HasPrefix(source, "http://") || strings.HasPrefix(source, "https://") {
		resp, err := http.Get(source)
		if err != nil {
			fmt.Println(errorStyle.Render("Error downloading script: " + err.Error()))
			return
		}
		defer resp.Body.Close()
		content, err = ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println(errorStyle.Render("Error reading response: " + err.Error()))
			return
		}
	} else {
		content, err = ioutil.ReadFile(source)
		if err != nil {
			fmt.Println(errorStyle.Render("Error reading file: " + err.Error()))
			return
		}
	}

	err = cfg.InstallScript(name, string(content))
	if err != nil {
		fmt.Println(errorStyle.Render("Error installing script: " + err.Error()))
		return
	}

	fmt.Println(successStyle.Render("✓ Entity @" + name + " installed successfully!"))
}

func executeScript(configDir, path string) {
	rt := runtime.NewRuntime(configDir)
	err := rt.Run(path)
	if err != nil {
		os.Exit(1)
	}
}
