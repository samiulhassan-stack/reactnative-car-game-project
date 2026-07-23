# ===============================================
# Car Racing Game - Quick Start Script (PowerShell)
# ===============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Car Racing Game - React Native" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "[OK] Node.js and npm detected ($npmVersion)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing dependencies..." -ForegroundColor Yellow
    Write-Host "This may take several minutes on first run." -ForegroundColor Yellow
    Write-Host ""
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] npm install failed" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[OK] Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "[OK] Dependencies already installed" -ForegroundColor Green
}

Write-Host ""

# Check if Android SDK is available
try {
    $adbVersion = adb --version
    Write-Host "[OK] Android SDK detected" -ForegroundColor Green
} catch {
    Write-Host "[WARNING] adb not found in PATH" -ForegroundColor Yellow
    Write-Host "Android development tools may not be configured" -ForegroundColor Yellow
    Write-Host "Please ensure ANDROID_HOME is set in environment variables" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""

# Check if emulator is running
$devices = adb devices
if ($devices -match "emulator") {
    Write-Host "[OK] Android Emulator detected and ready" -ForegroundColor Green
} else {
    Write-Host "[WARNING] No Android Emulator detected" -ForegroundColor Yellow
    Write-Host "Please start an emulator:" -ForegroundColor Yellow
    Write-Host "   1. Open Android Studio" -ForegroundColor Yellow
    Write-Host "   2. Go to Tools > AVD Manager" -ForegroundColor Yellow
    Write-Host "   3. Click the Play button next to any emulator" -ForegroundColor Yellow
    Write-Host "   4. Wait for emulator to fully start" -ForegroundColor Yellow
    Write-Host ""
    $proceed = Read-Host "Continue anyway? (y/n)"
    if ($proceed -ne "y" -and $proceed -ne "Y") {
        exit 0
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Metro Bundler..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The Metro bundler will start in a new terminal window." -ForegroundColor Yellow
Write-Host "Keep this terminal open while developing." -ForegroundColor Yellow
Write-Host ""

# Start Metro bundler in new window
Start-Process -NoNewWindow cmd.exe -ArgumentList '/k', 'npm start'

Start-Sleep -Seconds 5

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building and Running Game on Android..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

npx react-native run-android

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] Build failed" -ForegroundColor Red
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Ensure Android Emulator is running" -ForegroundColor Yellow
    Write-Host "   2. Check that ANDROID_HOME is set correctly" -ForegroundColor Yellow
    Write-Host "   3. Try: npm start -- --reset-cache" -ForegroundColor Yellow
    Write-Host "   4. Then: npx react-native run-android" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Game launched successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Controls:" -ForegroundColor Yellow
Write-Host "   - Swipe left/right to move" -ForegroundColor Yellow
Write-Host "   - Tap left/right buttons at bottom" -ForegroundColor Yellow
Write-Host "   - Tap pause button to pause" -ForegroundColor Yellow
Write-Host ""
Write-Host "The Metro bundler terminal is still running in background." -ForegroundColor Yellow
Write-Host "Keep it open for hot reload functionality." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
