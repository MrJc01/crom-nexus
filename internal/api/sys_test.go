package api

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/dop251/goja"
)

func setupTestDir(t *testing.T) string {
	dir, err := os.MkdirTemp("", "nexus-sys-test-*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	return dir
}

func TestNewSysModule(t *testing.T) {
	mod := NewSysModule("/tmp")
	if mod == nil {
		t.Fatal("NewSysModule returned nil")
	}
	if mod.BaseDir != "/tmp" {
		t.Errorf("Expected BaseDir /tmp, got %s", mod.BaseDir)
	}
}

func TestSysModule_Register(t *testing.T) {
	mod := NewSysModule("/tmp")
	vm := goja.New()
	nexus := vm.NewObject()

	mod.Register(vm, nexus)

	sys := nexus.Get("sys")
	if sys == nil || sys == goja.Undefined() {
		t.Fatal("sys module not registered on Nexus object")
	}
}

func TestSysModule_SaveAndLoad(t *testing.T) {
	testDir := setupTestDir(t)
	defer os.RemoveAll(testDir)

	mod := NewSysModule(testDir)
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	// Test save
	_, err := vm.RunString(`Nexus.sys.save("test.txt", "Hello World");`)
	if err != nil {
		t.Fatalf("Save failed: %v", err)
	}

	// Verify file exists
	content, err := os.ReadFile(filepath.Join(testDir, "test.txt"))
	if err != nil {
		t.Fatalf("File not created: %v", err)
	}
	if string(content) != "Hello World" {
		t.Errorf("Expected 'Hello World', got '%s'", string(content))
	}

	// Test load
	result, err := vm.RunString(`Nexus.sys.load("test.txt");`)
	if err != nil {
		t.Fatalf("Load failed: %v", err)
	}
	if result.String() != "Hello World" {
		t.Errorf("Load returned wrong content: %s", result.String())
	}
}

func TestSysModule_Exists(t *testing.T) {
	testDir := setupTestDir(t)
	defer os.RemoveAll(testDir)

	mod := NewSysModule(testDir)
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	// Test non-existent file
	result, err := vm.RunString(`Nexus.sys.exists("nonexistent.txt");`)
	if err != nil {
		t.Fatalf("Exists failed: %v", err)
	}
	if result.ToBoolean() != false {
		t.Error("Expected false for non-existent file")
	}

	// Create file and test again
	os.WriteFile(filepath.Join(testDir, "exists.txt"), []byte("test"), 0644)

	result, err = vm.RunString(`Nexus.sys.exists("exists.txt");`)
	if err != nil {
		t.Fatalf("Exists failed: %v", err)
	}
	if result.ToBoolean() != true {
		t.Error("Expected true for existing file")
	}
}

func TestSysModule_Mkdir(t *testing.T) {
	testDir := setupTestDir(t)
	defer os.RemoveAll(testDir)

	mod := NewSysModule(testDir)
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	result, err := vm.RunString(`Nexus.sys.mkdir("subdir/nested");`)
	if err != nil {
		t.Fatalf("Mkdir failed: %v", err)
	}
	if result.ToBoolean() != true {
		t.Error("Mkdir returned false")
	}

	// Verify directory exists
	info, err := os.Stat(filepath.Join(testDir, "subdir/nested"))
	if err != nil || !info.IsDir() {
		t.Error("Directory was not created")
	}
}

func TestSysModule_Remove(t *testing.T) {
	testDir := setupTestDir(t)
	defer os.RemoveAll(testDir)

	mod := NewSysModule(testDir)
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	// Create file first
	testFile := filepath.Join(testDir, "todelete.txt")
	os.WriteFile(testFile, []byte("delete me"), 0644)

	result, err := vm.RunString(`Nexus.sys.remove("todelete.txt");`)
	if err != nil {
		t.Fatalf("Remove failed: %v", err)
	}
	if result.ToBoolean() != true {
		t.Error("Remove returned false")
	}

	// Verify file was removed
	if _, err := os.Stat(testFile); !os.IsNotExist(err) {
		t.Error("File was not removed")
	}
}

func TestSysModule_ListDir(t *testing.T) {
	testDir := setupTestDir(t)
	defer os.RemoveAll(testDir)

	// Create some test files
	os.WriteFile(filepath.Join(testDir, "file1.txt"), []byte("1"), 0644)
	os.WriteFile(filepath.Join(testDir, "file2.txt"), []byte("2"), 0644)
	os.Mkdir(filepath.Join(testDir, "subdir"), 0755)

	mod := NewSysModule(testDir)
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	result, err := vm.RunString(`
		var files = Nexus.sys.listDir(".");
		files.length;
	`)
	if err != nil {
		t.Fatalf("ListDir failed: %v", err)
	}

	if result.ToInteger() != 3 {
		t.Errorf("Expected 3 items, got %d", result.ToInteger())
	}
}

func TestSysModule_Env(t *testing.T) {
	mod := NewSysModule("/tmp")
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	// Set a test env variable
	os.Setenv("NEXUS_TEST_VAR", "test_value")
	defer os.Unsetenv("NEXUS_TEST_VAR")

	result, err := vm.RunString(`Nexus.sys.env("NEXUS_TEST_VAR");`)
	if err != nil {
		t.Fatalf("Env failed: %v", err)
	}

	if result.String() != "test_value" {
		t.Errorf("Expected 'test_value', got '%s'", result.String())
	}
}

func TestSysModule_LoadNonExistent(t *testing.T) {
	testDir := setupTestDir(t)
	defer os.RemoveAll(testDir)

	mod := NewSysModule(testDir)
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	result, err := vm.RunString(`Nexus.sys.load("nonexistent.txt");`)
	if err != nil {
		t.Fatalf("Load failed: %v", err)
	}

	// Should return null for non-existent file
	if result != goja.Null() {
		t.Error("Expected null for non-existent file")
	}
}
