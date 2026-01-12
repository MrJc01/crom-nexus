package api

import (
	"testing"

	"github.com/dop251/goja"
)

func TestNewDOMModule(t *testing.T) {
	mod := NewDOMModule()
	if mod == nil {
		t.Fatal("NewDOMModule returned nil")
	}
}

func TestDOMModule_Register(t *testing.T) {
	mod := NewDOMModule()
	vm := goja.New()
	nexus := vm.NewObject()

	mod.Register(vm, nexus)

	dom := nexus.Get("dom")
	if dom == nil || dom == goja.Undefined() {
		t.Fatal("dom module not registered on Nexus object")
	}
}

func TestDOMModule_Parse(t *testing.T) {
	mod := NewDOMModule()
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	html := `
		<html>
			<head><title>Test Page</title></head>
			<body>
				<h1>Hello World</h1>
				<p class="content">First paragraph</p>
				<p class="content">Second paragraph</p>
				<a href="https://example.com">Link</a>
			</body>
		</html>
	`
	vm.Set("testHTML", html)

	// Test parsing and selecting h1
	result, err := vm.RunString(`
		var doc = Nexus.dom.parse(testHTML);
		var titles = doc.select("h1");
		titles.length;
	`)

	if err != nil {
		t.Fatalf("Script execution failed: %v", err)
	}

	if result.ToInteger() != 1 {
		t.Errorf("Expected 1 h1 element, got %d", result.ToInteger())
	}
}

func TestDOMModule_SelectMultiple(t *testing.T) {
	mod := NewDOMModule()
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	html := `
		<ul>
			<li>Item 1</li>
			<li>Item 2</li>
			<li>Item 3</li>
		</ul>
	`
	vm.Set("testHTML", html)

	result, err := vm.RunString(`
		var doc = Nexus.dom.parse(testHTML);
		var items = doc.select("li");
		items.length;
	`)

	if err != nil {
		t.Fatalf("Script execution failed: %v", err)
	}

	if result.ToInteger() != 3 {
		t.Errorf("Expected 3 li elements, got %d", result.ToInteger())
	}
}

func TestDOMModule_SelectText(t *testing.T) {
	mod := NewDOMModule()
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	html := `<div><h1>Test Title</h1></div>`
	vm.Set("testHTML", html)

	result, err := vm.RunString(`
		var doc = Nexus.dom.parse(testHTML);
		var titles = doc.select("h1");
		titles[0].text();
	`)

	if err != nil {
		t.Fatalf("Script execution failed: %v", err)
	}

	if result.String() != "Test Title" {
		t.Errorf("Expected 'Test Title', got '%s'", result.String())
	}
}

func TestDOMModule_SelectAttr(t *testing.T) {
	mod := NewDOMModule()
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	html := `<a href="https://example.com" class="link">Click me</a>`
	vm.Set("testHTML", html)

	result, err := vm.RunString(`
		var doc = Nexus.dom.parse(testHTML);
		var links = doc.select("a");
		links[0].attr("href");
	`)

	if err != nil {
		t.Fatalf("Script execution failed: %v", err)
	}

	if result.String() != "https://example.com" {
		t.Errorf("Expected 'https://example.com', got '%s'", result.String())
	}
}

func TestDOMModule_SelectEmpty(t *testing.T) {
	mod := NewDOMModule()
	vm := goja.New()
	nexus := vm.NewObject()
	mod.Register(vm, nexus)

	vm.Set("Nexus", nexus)

	html := `<div><p>No spans here</p></div>`
	vm.Set("testHTML", html)

	result, err := vm.RunString(`
		var doc = Nexus.dom.parse(testHTML);
		var spans = doc.select("span");
		spans ? spans.length : 0;
	`)

	if err != nil {
		t.Fatalf("Script execution failed: %v", err)
	}

	if result.ToInteger() != 0 {
		t.Errorf("Expected 0 elements, got %d", result.ToInteger())
	}
}
