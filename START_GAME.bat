@echo off
REM ===============================================
REM Car Racing Game - Quick Start Script
REM ===============================================

echo.
echo ========================================
echo   Car Racing Game - React Native
echo ========================================
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js and npm detected
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    echo This may take several minutes on first run.
    echo.
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
    echo.
) else (
    echo [OK] Dependencies already installed
    echo.
)

REM Check if Android SDK is available
adb --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] adb not found in PATH
    echo Android development tools may not be configured
    echo Please ensure ANDROID_HOME is set:
    echo   setx ANDROID_HOME "C:\Users\%%USERNAME%%\AppData\Local\Android\Sdk"
    echo.
)

REM Check if emulator is running
adb devices | find "emulator" >nul 2>&1
if errorlevel 1 (
    echo [WARNING] No Android Emulator detected
    echo Please start an emulator:
    echo   1. Open Android Studio
    echo   2. Go to Tools ^> AVD Manager
    echo   3. Click the Play button next to any emulator
    echo   4. Wait for emulator to fully start
    echo.
    set /p proceed="Continue anyway? (y/n): "
    if /i not "%proceed%"=="y" (
        exit /b 0
    )
) else (
    echo [OK] Android Emulator detected and ready
    echo.
)

echo ========================================
echo Starting Metro Bundler...
echo ========================================
echo.
echo The Metro bundler will start in a new terminal window.
echo Keep this terminal open while developing.
echo.
start cmd /k "npm start"

timeout /t 5

echo ========================================
echo Building and Running Game on Android...
echo ========================================
echo.

call npx react-native run-android

if errorlevel 1 (
    echo.
    echo [ERROR] Build failed
    echo Troubleshooting:
    echo   1. Ensure Android Emulator is running
    echo   2. Check that ANDROID_HOME is set correctly
    echo   3. Try: npm start -- --reset-cache
    echo   4. Then: npx react-native run-android
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Game launched successfully!
echo ========================================
echo.
echo Controls:
echo   - Swipe left/right to move
echo   - Tap left/right buttons at bottom
echo   - Tap pause button to pause
echo.
echo The Metro bundler terminal is still running in background.
echo Keep it open for hot reload functionality.
echo.
pause
