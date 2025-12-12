.PHONY: build build-all clean test

VERSION := 1.0.0
BINARY := nexus

# Default: build for current OS
build:
	go build -ldflags "-s -w" -o $(BINARY) ./cmd/nexus

# Cross-platform builds
build-all: clean
	@echo "Building for Windows x64..."
	GOOS=windows GOARCH=amd64 go build -ldflags "-s -w" -o dist/$(BINARY)-windows-x64.exe ./cmd/nexus
	@echo "Building for Linux x64..."
	GOOS=linux GOARCH=amd64 go build -ldflags "-s -w" -o dist/$(BINARY)-linux-x64 ./cmd/nexus
	@echo "Building for Linux ARM64..."
	GOOS=linux GOARCH=arm64 go build -ldflags "-s -w" -o dist/$(BINARY)-linux-arm64 ./cmd/nexus
	@echo "Building for macOS x64..."
	GOOS=darwin GOARCH=amd64 go build -ldflags "-s -w" -o dist/$(BINARY)-darwin-x64 ./cmd/nexus
	@echo "Building for macOS ARM64 (M1/M2)..."
	GOOS=darwin GOARCH=arm64 go build -ldflags "-s -w" -o dist/$(BINARY)-darwin-arm64 ./cmd/nexus
	@echo "Done! Binaries in dist/"

# Run tests
test:
	./$(BINARY) run tests/02_dom_parser.js
	./$(BINARY) run tests/04_filesystem.js
	./$(BINARY) run tests/05_workflow_mock.js

# Clean build artifacts
clean:
	rm -rf dist/
	mkdir -p dist/

# Install locally
install: build
	cp $(BINARY) /usr/local/bin/
