#!/bin/bash

# Nexus Installation Script
# Usage: curl -sL https://raw.githubusercontent.com/MrJc01/crom-nexus/main/scripts/install.sh | bash

set -e

REPO="MrJc01/crom-nexus"
INSTALL_DIR="/usr/local/bin"
BINARY_NAME="nexus"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_banner() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}       ${GREEN}Nexus Installer${NC}                   ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC}   The Terminal Runtime for the Web     ${BLUE}║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
    echo ""
}

detect_os() {
    OS=$(uname -s | tr '[:upper:]' '[:lower:]')
    case "$OS" in
        linux*)  OS="linux" ;;
        darwin*) OS="darwin" ;;
        *)       
            echo -e "${RED}Error: Unsupported operating system: $OS${NC}"
            exit 1
            ;;
    esac
}

detect_arch() {
    ARCH=$(uname -m)
    case "$ARCH" in
        x86_64|amd64)   ARCH="amd64" ;;
        arm64|aarch64)  ARCH="arm64" ;;
        *)              
            echo -e "${RED}Error: Unsupported architecture: $ARCH${NC}"
            exit 1
            ;;
    esac
}

get_latest_version() {
    echo -e "${BLUE}→ Fetching latest version...${NC}"
    VERSION=$(curl -sL "https://api.github.com/repos/${REPO}/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
    
    if [ -z "$VERSION" ]; then
        echo -e "${YELLOW}Warning: Could not fetch latest version, using v3.0.0${NC}"
        VERSION="v3.0.0"
    fi
    
    echo -e "${GREEN}✓ Latest version: ${VERSION}${NC}"
}

download_binary() {
    BINARY_URL="https://github.com/${REPO}/releases/download/${VERSION}/${BINARY_NAME}-${OS}-${ARCH}"
    TMP_DIR=$(mktemp -d)
    TMP_FILE="${TMP_DIR}/${BINARY_NAME}"
    
    echo -e "${BLUE}→ Downloading nexus-${OS}-${ARCH}...${NC}"
    
    if command -v curl &> /dev/null; then
        curl -sL "${BINARY_URL}" -o "${TMP_FILE}"
    elif command -v wget &> /dev/null; then
        wget -q "${BINARY_URL}" -O "${TMP_FILE}"
    else
        echo -e "${RED}Error: curl or wget is required${NC}"
        exit 1
    fi
    
    if [ ! -f "${TMP_FILE}" ] || [ ! -s "${TMP_FILE}" ]; then
        echo -e "${RED}Error: Failed to download binary${NC}"
        rm -rf "${TMP_DIR}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Download complete${NC}"
}

install_binary() {
    echo -e "${BLUE}→ Installing to ${INSTALL_DIR}...${NC}"
    
    chmod +x "${TMP_FILE}"
    
    # Try to install to system directory
    if [ -w "${INSTALL_DIR}" ]; then
        mv "${TMP_FILE}" "${INSTALL_DIR}/${BINARY_NAME}"
    else
        echo -e "${YELLOW}→ Requires sudo for installation${NC}"
        sudo mv "${TMP_FILE}" "${INSTALL_DIR}/${BINARY_NAME}"
    fi
    
    rm -rf "${TMP_DIR}"
    
    echo -e "${GREEN}✓ Installed to ${INSTALL_DIR}/${BINARY_NAME}${NC}"
}

verify_installation() {
    if command -v nexus &> /dev/null; then
        INSTALLED_VERSION=$(nexus --version 2>/dev/null || echo "unknown")
        echo ""
        echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║  ✓ Nexus installed successfully!       ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${BLUE}Get started:${NC}"
        echo "  nexus help              # Show help"
        echo "  nexus @ip               # Get your public IP"
        echo "  nexus run hello.js      # Run a script"
        echo ""
    else
        echo -e "${RED}Error: Installation verification failed${NC}"
        exit 1
    fi
}

setup_config() {
    CONFIG_DIR="${HOME}/.nexus"
    if [ ! -d "${CONFIG_DIR}" ]; then
        mkdir -p "${CONFIG_DIR}"
        echo '{"entities":{}}' > "${CONFIG_DIR}/config.json"
        echo -e "${GREEN}✓ Created config directory: ${CONFIG_DIR}${NC}"
    fi
}

main() {
    print_banner
    detect_os
    detect_arch
    echo -e "${BLUE}→ Detected: ${OS}/${ARCH}${NC}"
    get_latest_version
    download_binary
    install_binary
    setup_config
    verify_installation
}

main "$@"
