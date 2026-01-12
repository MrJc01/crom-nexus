# Nexus Installation Script for Windows PowerShell
# Usage: iwr https://raw.githubusercontent.com/MrJc01/crom-nexus/main/scripts/install.ps1 -useb | iex

$ErrorActionPreference = "Stop"

$REPO = "MrJc01/crom-nexus"
$BINARY_NAME = "nexus.exe"
$INSTALL_DIR = "$env:LOCALAPPDATA\Programs\Nexus"

function Write-Banner {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Blue
    Write-Host "║       Nexus Installer                  ║" -ForegroundColor Blue
    Write-Host "║   The Terminal Runtime for the Web    ║" -ForegroundColor Blue
    Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Blue
    Write-Host ""
}

function Get-LatestVersion {
    Write-Host "→ Fetching latest version..." -ForegroundColor Cyan
    
    try {
        $release = Invoke-RestMethod -Uri "https://api.github.com/repos/$REPO/releases/latest"
        $version = $release.tag_name
        Write-Host "✓ Latest version: $version" -ForegroundColor Green
        return $version
    }
    catch {
        Write-Host "Warning: Could not fetch latest version, using v3.0.0" -ForegroundColor Yellow
        return "v3.0.0"
    }
}

function Download-Binary {
    param([string]$Version)
    
    $arch = if ([Environment]::Is64BitOperatingSystem) { "amd64" } else { "386" }
    $binaryUrl = "https://github.com/$REPO/releases/download/$Version/nexus-windows-$arch.exe"
    
    Write-Host "→ Downloading nexus-windows-$arch.exe..." -ForegroundColor Cyan
    
    # Create install directory
    if (-not (Test-Path $INSTALL_DIR)) {
        New-Item -ItemType Directory -Path $INSTALL_DIR -Force | Out-Null
    }
    
    $downloadPath = Join-Path $INSTALL_DIR $BINARY_NAME
    
    try {
        Invoke-WebRequest -Uri $binaryUrl -OutFile $downloadPath -UseBasicParsing
        Write-Host "✓ Download complete" -ForegroundColor Green
        return $downloadPath
    }
    catch {
        Write-Host "Error: Failed to download binary" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        exit 1
    }
}

function Add-ToPath {
    Write-Host "→ Adding to PATH..." -ForegroundColor Cyan
    
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    
    if ($currentPath -notlike "*$INSTALL_DIR*") {
        $newPath = "$currentPath;$INSTALL_DIR"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        $env:Path = "$env:Path;$INSTALL_DIR"
        Write-Host "✓ Added $INSTALL_DIR to PATH" -ForegroundColor Green
    }
    else {
        Write-Host "✓ $INSTALL_DIR already in PATH" -ForegroundColor Green
    }
}

function Setup-Config {
    $configDir = Join-Path $env:USERPROFILE ".nexus"
    
    if (-not (Test-Path $configDir)) {
        New-Item -ItemType Directory -Path $configDir -Force | Out-Null
        $configFile = Join-Path $configDir "config.json"
        '{"entities":{}}' | Out-File -FilePath $configFile -Encoding UTF8
        Write-Host "✓ Created config directory: $configDir" -ForegroundColor Green
    }
}

function Verify-Installation {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║  ✓ Nexus installed successfully!       ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "Installation location: $INSTALL_DIR" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Get started:" -ForegroundColor Blue
    Write-Host "  nexus help              # Show help"
    Write-Host "  nexus @ip               # Get your public IP"
    Write-Host "  nexus run hello.js      # Run a script"
    Write-Host ""
    Write-Host "NOTE: You may need to restart your terminal for PATH changes to take effect." -ForegroundColor Yellow
}

function Main {
    Write-Banner
    
    $version = Get-LatestVersion
    $binaryPath = Download-Binary -Version $version
    Add-ToPath
    Setup-Config
    Verify-Installation
}

Main
