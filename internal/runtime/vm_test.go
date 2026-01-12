package runtime

import (
	"os"
	"path/filepath"
	"testing"
)

func setupRuntimeTestDir(t *testing.T) string {
	dir, err := os.MkdirTemp("", "nexus-runtime-test-*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	return dir
}

func TestNewRuntime(t *testing.T) {
	testDir := setupRuntimeTestDir(t)
	defer os.RemoveAll(testDir)

	rt := NewRuntime(testDir)
	if rt == nil {
		t.Fatal("NewRuntime returned nil")
	}
	if rt.vm == nil {
		t.Fatal("Runtime VM is nil")
	}
	if rt.configDir != testDir {
		t.Errorf("Expected configDir %s, got %s", testDir, rt.configDir)
	}
}

func TestRuntime_SetOutputFormat(t *testing.T) {
	testDir := setupRuntimeTestDir(t)
	defer os.RemoveAll(testDir)

	rt := NewRuntime(testDir)
	rt.SetOutputFormat("json")

	if rt.outputFormat != "json" {
		t.Errorf("Expected outputFormat 'json', got '%s'", rt.outputFormat)
	}
}

func TestRuntime_NexusObjectExists(t *testing.T) {
	testDir := setupRuntimeTestDir(t)
	defer os.RemoveAll(testDir)

	rt := NewRuntime(testDir)

	result, err := rt.vm.RunString(`typeof Nexus`)
	if err != nil {
		t.Fatalf("Script failed: %v", err)
	}

	if result.String() != "object" {
		t.Errorf("Nexus should be an object, got '%s'", result.String())
	}
}

func TestRuntime_ModulesRegistered(t *testing.T) {
	testDir := setupRuntimeTestDir(t)
	defer os.RemoveAll(testDir)

	rt := NewRuntime(testDir)

	modules := []string{"http", "dom", "sys", "tui", "secure"}
	for _, mod := range modules {
		result, err := rt.vm.RunString(`typeof Nexus.` + mod)
		if err != nil {
			t.Fatalf("Script failed for %s: %v", mod, err)
		}
		if result.String() != "object" {
			t.Errorf("Nexus.%s should be an object, got '%s'", mod, result.String())
		}
	}
}

func TestRuntime_ConsoleLogExists(t *testing.T) {
	testDir := setupRuntimeTestDir(t)
	defer os.RemoveAll(testDir)

	rt := NewRuntime(testDir)

	result, err := rt.vm.RunString(`typeof console.log`)
	if err != nil {
		t.Fatalf("Script failed: %v", err)
	}

	if result.String() != "function" {
		t.Errorf("console.log should be a function, got '%s'", result.String())
	}
}

func TestRuntime_RunInline(t *testing.T) {
	testDir := setupRuntimeTestDir(t)
	defer os.RemoveAll(testDir)

	rt := NewRuntime(testDir)
	rt.SetOutputFormat("json") // Suppress TUI output

	err := rt.RunInline(`var x = 1 + 1;`)
	if err != nil {
		t.Fatalf("RunInline failed: %v", err)
	}
}

func TestRuntime_RunInlineWithResult(t *testing.T) {
	testDir := setupRuntimeTestDir(t)
	defer os.RemoveAll(testDir)

	rt := NewRuntime(testDir)

	// Set a global variable
	err := rt.RunInline(`var testResult = 42;`)
	if err != nil {
		t.Fatalf("RunInline failed: %v", err)
	}

	// Verify it was set
	result, err := rt.vm.RunString(`testResult`)
	if err != nil {
		t.Fatalf("Failed to get result: %v", err)
	}

	if result.ToInteger() != 42 {
		t.Errorf("Expected 42, got %d", result.ToInteger())
	}
}

func TestRuntime_Run(t *testing.T) {
	testDir := setupRuntimeTestDir(t)
	defer os.RemoveAll(testDir)

	// Create a test script
	scriptPath := filepath.Join(testDir, "test_script.js")
	scriptContent := `var sum = 1 + 2 + 3;`
	if err := os.WriteFile(scriptPath, []byte(scriptContent), 0644); err != nil {
		t.Fatalf("Failed to create test script: %v", err)
	}

	rt := NewRuntime(testDir)
	rt.SetOutputFormat("json") // Suppress TUI output

	err := rt.Run(scriptPath)
	if err != nil {
		t.Fatalf("Run failed: %v", err)
	}

	// Verify the script ran
	result, err := rt.vm.RunString(`sum`)
	if err != nil {
		t.Fatalf("Failed to get sum: %v", err)
	}

	if result.ToInteger() != 6 {
		t.Errorf("Expected 6, got %d", result.ToInteger())
	}
}

func TestRuntime_RunWithArgs(t *testing.T) {
	testDir := setupRuntimeTestDir(t)
	defer os.RemoveAll(testDir)

	// Create a test script
	scriptPath := filepath.Join(testDir, "args_script.js")
	scriptContent := `var argCount = __args__.length;`
	if err := os.WriteFile(scriptPath, []byte(scriptContent), 0644); err != nil {
		t.Fatalf("Failed to create test script: %v", err)
	}

	rt := NewRuntime(testDir)
	rt.SetOutputFormat("json")

	err := rt.RunWithArgs(scriptPath, "testcmd", []string{"arg1", "arg2"})
	if err != nil {
		t.Fatalf("RunWithArgs failed: %v", err)
	}

	// Verify args were injected
	result, err := rt.vm.RunString(`argCount`)
	if err != nil {
		t.Fatalf("Failed to get argCount: %v", err)
	}

	// Should be 3: command + 2 args
	if result.ToInteger() != 3 {
		t.Errorf("Expected 3 args, got %d", result.ToInteger())
	}

	// Verify command
	cmdResult, err := rt.vm.RunString(`__command__`)
	if err != nil {
		t.Fatalf("Failed to get command: %v", err)
	}

	if cmdResult.String() != "testcmd" {
		t.Errorf("Expected 'testcmd', got '%s'", cmdResult.String())
	}
}

func TestRuntime_RunNonExistentFile(t *testing.T) {
	testDir := setupRuntimeTestDir(t)
	defer os.RemoveAll(testDir)

	rt := NewRuntime(testDir)
	rt.SetOutputFormat("json")

	err := rt.Run(filepath.Join(testDir, "nonexistent.js"))
	if err == nil {
		t.Error("Expected error for non-existent file")
	}
}

func TestRuntime_RunSyntaxError(t *testing.T) {
	testDir := setupRuntimeTestDir(t)
	defer os.RemoveAll(testDir)

	// Create a script with syntax error
	scriptPath := filepath.Join(testDir, "syntax_error.js")
	scriptContent := `var x = {;` // Invalid syntax
	if err := os.WriteFile(scriptPath, []byte(scriptContent), 0644); err != nil {
		t.Fatalf("Failed to create test script: %v", err)
	}

	rt := NewRuntime(testDir)
	rt.SetOutputFormat("json")

	err := rt.Run(scriptPath)
	if err == nil {
		t.Error("Expected error for syntax error")
	}
}

func TestRuntime_NexusHTTPAvailable(t *testing.T) {
	testDir := setupRuntimeTestDir(t)
	defer os.RemoveAll(testDir)

	rt := NewRuntime(testDir)

	result, err := rt.vm.RunString(`typeof Nexus.http.get`)
	if err != nil {
		t.Fatalf("Script failed: %v", err)
	}

	if result.String() != "function" {
		t.Errorf("Nexus.http.get should be a function, got '%s'", result.String())
	}
}

func TestRuntime_NexusSysAvailable(t *testing.T) {
	testDir := setupRuntimeTestDir(t)
	defer os.RemoveAll(testDir)

	rt := NewRuntime(testDir)

	funcs := []string{"save", "load", "exists", "mkdir", "remove"}
	for _, fn := range funcs {
		result, err := rt.vm.RunString(`typeof Nexus.sys.` + fn)
		if err != nil {
			t.Fatalf("Script failed for %s: %v", fn, err)
		}
		if result.String() != "function" {
			t.Errorf("Nexus.sys.%s should be a function, got '%s'", fn, result.String())
		}
	}
}
