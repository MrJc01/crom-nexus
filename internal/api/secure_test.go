package api

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/dop251/goja"
)

func setupSecureTestDir(t *testing.T) string {
	dir, err := os.MkdirTemp("", "nexus-secure-test-*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	return dir
}

func TestNewSecureModule(t *testing.T) {
	mod := NewSecureModule("/tmp")
	if mod == nil {
		t.Fatal("NewSecureModule returned nil")
	}
	if mod.ConfigDir != "/tmp" {
		t.Errorf("Expected ConfigDir /tmp, got %s", mod.ConfigDir)
	}
}

func TestSecureModule_Register(t *testing.T) {
	testDir := setupSecureTestDir(t)
	defer os.RemoveAll(testDir)

	mod := NewSecureModule(testDir)
	vm := goja.New()
	nexus := vm.NewObject()

	mod.Register(vm, nexus)

	secure := nexus.Get("secure")
	if secure == nil || secure == goja.Undefined() {
		t.Fatal("secure module not registered on Nexus object")
	}
}

func TestSecureModule_InitKey(t *testing.T) {
	testDir := setupSecureTestDir(t)
	defer os.RemoveAll(testDir)

	mod := NewSecureModule(testDir)
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	// Key should be generated
	keyPath := filepath.Join(testDir, "vault.key")
	if _, err := os.Stat(keyPath); os.IsNotExist(err) {
		t.Fatal("vault.key was not created")
	}

	// Key should be 32 bytes (AES-256)
	keyData, err := os.ReadFile(keyPath)
	if err != nil {
		t.Fatalf("Failed to read key: %v", err)
	}
	if len(keyData) != 32 {
		t.Errorf("Expected 32 byte key, got %d bytes", len(keyData))
	}
}

func TestSecureModule_SetAndGet(t *testing.T) {
	testDir := setupSecureTestDir(t)
	defer os.RemoveAll(testDir)

	mod := NewSecureModule(testDir)
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	// Set a secret
	_, err := vm.RunString(`Nexus.secure.set("api_key", "secret123");`)
	if err != nil {
		t.Fatalf("Set failed: %v", err)
	}

	// Get the secret back
	result, err := vm.RunString(`Nexus.secure.get("api_key");`)
	if err != nil {
		t.Fatalf("Get failed: %v", err)
	}

	if result.String() != "secret123" {
		t.Errorf("Expected 'secret123', got '%s'", result.String())
	}
}

func TestSecureModule_GetNonExistent(t *testing.T) {
	testDir := setupSecureTestDir(t)
	defer os.RemoveAll(testDir)

	mod := NewSecureModule(testDir)
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	result, err := vm.RunString(`Nexus.secure.get("nonexistent");`)
	if err != nil {
		t.Fatalf("Get failed: %v", err)
	}

	if result != goja.Null() {
		t.Error("Expected null for non-existent key")
	}
}

func TestSecureModule_OverwriteKey(t *testing.T) {
	testDir := setupSecureTestDir(t)
	defer os.RemoveAll(testDir)

	mod := NewSecureModule(testDir)
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	// Set initial value
	_, err := vm.RunString(`Nexus.secure.set("key", "value1");`)
	if err != nil {
		t.Fatalf("Set failed: %v", err)
	}

	// Overwrite with new value
	_, err = vm.RunString(`Nexus.secure.set("key", "value2");`)
	if err != nil {
		t.Fatalf("Set failed: %v", err)
	}

	// Verify new value
	result, err := vm.RunString(`Nexus.secure.get("key");`)
	if err != nil {
		t.Fatalf("Get failed: %v", err)
	}

	if result.String() != "value2" {
		t.Errorf("Expected 'value2', got '%s'", result.String())
	}
}

func TestSecureModule_Persistence(t *testing.T) {
	testDir := setupSecureTestDir(t)
	defer os.RemoveAll(testDir)

	// First instance - set value
	mod1 := NewSecureModule(testDir)
	vm1 := goja.New()
	nexus1 := vm1.NewObject()
	mod1.Register(vm1, nexus1)
	vm1.Set("Nexus", nexus1)

	_, err := vm1.RunString(`Nexus.secure.set("persistent_key", "persistent_value");`)
	if err != nil {
		t.Fatalf("Set failed: %v", err)
	}

	// Second instance - get value (simulates restart)
	mod2 := NewSecureModule(testDir)
	vm2 := goja.New()
	nexus2 := vm2.NewObject()
	mod2.Register(vm2, nexus2)
	vm2.Set("Nexus", nexus2)

	result, err := vm2.RunString(`Nexus.secure.get("persistent_key");`)
	if err != nil {
		t.Fatalf("Get failed: %v", err)
	}

	if result.String() != "persistent_value" {
		t.Errorf("Expected 'persistent_value', got '%s'", result.String())
	}
}

func TestSecureModule_EncryptDecrypt(t *testing.T) {
	testDir := setupSecureTestDir(t)
	defer os.RemoveAll(testDir)

	mod := NewSecureModule(testDir)
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	// Test internal encrypt/decrypt
	plaintext := "This is a secret message!"
	encrypted, err := mod.encrypt(plaintext)
	if err != nil {
		t.Fatalf("Encrypt failed: %v", err)
	}

	if encrypted == plaintext {
		t.Error("Encrypted text should be different from plaintext")
	}

	decrypted, err := mod.decrypt(encrypted)
	if err != nil {
		t.Fatalf("Decrypt failed: %v", err)
	}

	if decrypted != plaintext {
		t.Errorf("Decrypted text doesn't match: expected '%s', got '%s'", plaintext, decrypted)
	}
}

func TestSecureModule_MultipleKeys(t *testing.T) {
	testDir := setupSecureTestDir(t)
	defer os.RemoveAll(testDir)

	mod := NewSecureModule(testDir)
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	// Set multiple keys
	_, err := vm.RunString(`
		Nexus.secure.set("key1", "value1");
		Nexus.secure.set("key2", "value2");
		Nexus.secure.set("key3", "value3");
	`)
	if err != nil {
		t.Fatalf("Set failed: %v", err)
	}

	// Verify all keys
	tests := []struct {
		key      string
		expected string
	}{
		{"key1", "value1"},
		{"key2", "value2"},
		{"key3", "value3"},
	}

	for _, tt := range tests {
		vm.Set("testKey", tt.key)
		result, err := vm.RunString(`Nexus.secure.get(testKey);`)
		if err != nil {
			t.Fatalf("Get failed for %s: %v", tt.key, err)
		}
		if result.String() != tt.expected {
			t.Errorf("Key %s: expected '%s', got '%s'", tt.key, tt.expected, result.String())
		}
	}
}
