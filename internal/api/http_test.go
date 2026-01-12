package api

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/dop251/goja"
)

func TestNewHTTPModule(t *testing.T) {
	mod := NewHTTPModule()
	if mod == nil {
		t.Fatal("NewHTTPModule returned nil")
	}
	if mod.Client == nil {
		t.Fatal("HTTP Client is nil")
	}
	if mod.Retries != 3 {
		t.Errorf("Expected 3 retries, got %d", mod.Retries)
	}
}

func TestHTTPModule_Register(t *testing.T) {
	mod := NewHTTPModule()
	vm := goja.New()
	nexus := vm.NewObject()

	mod.Register(vm, nexus)

	// Verify http object was registered
	http := nexus.Get("http")
	if http == nil || http == goja.Undefined() {
		t.Fatal("http module not registered on Nexus object")
	}
}

func TestHTTPModule_Get(t *testing.T) {
	// Create test server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			t.Errorf("Expected GET request, got %s", r.Method)
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"hello"}`))
	}))
	defer server.Close()

	mod := NewHTTPModule()
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	// Execute GET request via script
	vm.Set("Nexus", nexus)
	vm.Set("testURL", server.URL)

	result, err := vm.RunString(`
		var resp = Nexus.http.get(testURL);
		resp;
	`)

	if err != nil {
		t.Fatalf("Script execution failed: %v", err)
	}

	obj := result.Export().(map[string]interface{})

	// Handle different int types
	var status int64
	switch v := obj["status"].(type) {
	case int:
		status = int64(v)
	case int64:
		status = v
	case float64:
		status = int64(v)
	}

	if status != 200 {
		t.Errorf("Expected status 200, got %v", obj["status"])
	}
	if obj["body"].(string) != `{"message":"hello"}` {
		t.Errorf("Unexpected body: %s", obj["body"])
	}
}

func TestHTTPModule_Post(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			t.Errorf("Expected POST request, got %s", r.Method)
		}
		if r.Header.Get("Content-Type") != "application/json" {
			t.Errorf("Expected Content-Type application/json")
		}
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(`{"success":true}`))
	}))
	defer server.Close()

	mod := NewHTTPModule()
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)
	vm.Set("testURL", server.URL)

	result, err := vm.RunString(`
		var resp = Nexus.http.post(testURL, '{"data":"test"}');
		resp;
	`)

	if err != nil {
		t.Fatalf("Script execution failed: %v", err)
	}

	obj := result.Export().(map[string]interface{})

	// Handle different int types
	var status int64
	switch v := obj["status"].(type) {
	case int:
		status = int64(v)
	case int64:
		status = v
	case float64:
		status = int64(v)
	}

	if status != 201 {
		t.Errorf("Expected status 201, got %v", obj["status"])
	}
}

func TestHTTPModule_SetTimeout(t *testing.T) {
	mod := NewHTTPModule()
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	_, err := vm.RunString(`Nexus.http.setTimeout(5000);`)
	if err != nil {
		t.Fatalf("setTimeout failed: %v", err)
	}

	if mod.Timeout.Milliseconds() != 5000 {
		t.Errorf("Expected timeout 5000ms, got %d", mod.Timeout.Milliseconds())
	}
}

func TestHTTPModule_SetRetries(t *testing.T) {
	mod := NewHTTPModule()
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	_, err := vm.RunString(`Nexus.http.setRetries(5);`)
	if err != nil {
		t.Fatalf("setRetries failed: %v", err)
	}

	if mod.Retries != 5 {
		t.Errorf("Expected 5 retries, got %d", mod.Retries)
	}
}
