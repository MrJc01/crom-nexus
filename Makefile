.PHONY: build build-all clean test test-go test-js lint install

VERSION := 3.1.0
BINARY := nexus

# Default: build for current OS
build:
	go build -ldflags "-s -w -X main.Version=$(VERSION)" -o $(BINARY) ./cmd/nexus

# Cross-platform builds
build-all: clean
	@echo "Building for Windows x64..."
	GOOS=windows GOARCH=amd64 go build -ldflags "-s -w" -o dist/$(BINARY)-windows-amd64.exe ./cmd/nexus
	@echo "Building for Linux x64..."
	GOOS=linux GOARCH=amd64 go build -ldflags "-s -w" -o dist/$(BINARY)-linux-amd64 ./cmd/nexus
	@echo "Building for Linux ARM64..."
	GOOS=linux GOARCH=arm64 go build -ldflags "-s -w" -o dist/$(BINARY)-linux-arm64 ./cmd/nexus
	@echo "Building for macOS x64..."
	GOOS=darwin GOARCH=amd64 go build -ldflags "-s -w" -o dist/$(BINARY)-darwin-amd64 ./cmd/nexus
	@echo "Building for macOS ARM64 (M1/M2)..."
	GOOS=darwin GOARCH=arm64 go build -ldflags "-s -w" -o dist/$(BINARY)-darwin-arm64 ./cmd/nexus
	@echo "Done! Binaries in dist/"

# Run all tests
test: test-go test-js
	@echo "All tests completed!"

# Run Go unit tests
test-go:
	@echo "Running Go unit tests..."
	go test ./... -v -race -cover

# Run JS integration tests
test-js: build
	@echo "Running JS integration tests..."
	./$(BINARY) run tests/02_dom_parser.js
	./$(BINARY) run tests/04_filesystem.js
	./$(BINARY) run tests/05_workflow_mock.js

# Run linter
lint:
	@echo "Running linter..."
	golangci-lint run ./...

# Generate coverage report
coverage:
	@echo "Generating coverage report..."
	go test ./... -coverprofile=coverage.out
	go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report: coverage.html"

# Clean build artifacts
clean:
	rm -rf dist/
	rm -f coverage.out coverage.html
	rm -f $(BINARY) $(BINARY).exe
	mkdir -p dist/

# Install locally
install: build
	cp $(BINARY) /usr/local/bin/

# Development: watch and rebuild
dev: build
	@echo "Nexus $(VERSION) built. Run with: ./$(BINARY)"

# Show help
help:
	@echo "Nexus Makefile"
	@echo ""
	@echo "Targets:"
	@echo "  build       - Build for current OS"
	@echo "  build-all   - Build for all platforms"
	@echo "  test        - Run all tests (Go + JS)"
	@echo "  test-go     - Run Go unit tests only"
	@echo "  test-js     - Run JS integration tests only"
	@echo "  lint        - Run golangci-lint"
	@echo "  coverage    - Generate coverage report"
	@echo "  clean       - Clean build artifacts"
	@echo "  install     - Install to /usr/local/bin"
	@echo "  help        - Show this help"
