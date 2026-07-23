# Complete Installation Guide

Step-by-step instructions to set up and run the Car Racing Game.

## System Requirements

### Minimum Requirements
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: 8GB minimum (16GB recommended)
- **Disk Space**: 20GB for Android SDK + emulator
- **Node.js**: v16.13.0 or higher
- **npm**: v8.0.0 or higher

### Android Development Setup

You need either:
1. **Android Studio** (Recommended) - Full IDE with emulator
2. **Android SDK** - Command-line tools only
3. **Physical Android Device** - Android 5.0 (API 21) or higher

## Step 1: Install Node.js

### Windows
1. Download from https://nodejs.org (LTS version recommended)
2. Run the installer
3. Accept all defaults
4. Verify installation:
```bash
node --version
npm --version
```

### macOS
```bash
# Using Homebrew (recommended)
brew install node

# Or download from https://nodejs.org
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nodejs npm
```

Verify installation:
```bash
node --version  # Should be v16+
npm --version   # Should be v8+
```

## Step 2: Set Up Android Development Environment

### Option A: Using Android Studio (Recommended)

1. **Download Android Studio**
   - Go to https://developer.android.com/studio
   - Download the latest version

2. **Install Android Studio**
   - Run the installer
   - Accept all setup defaults
   - Wait for Android SDK to download (~3-5 GB)

3. **Configure Environment**
   - Open Android Studio
   - Go to **Settings > Appearance & Behavior > System Settings > Android SDK**
   - Note the **Android SDK Location** (usually `~/Android/Sdk`)

4. **Create Android Emulator**
   - In Android Studio: **Tools > Device Manager > Create Device**
   - Select **Pixel 4** (or any device)
   - Select **Android 13** (API 33) or higher
   - Click **Finish**

### Option B: Command-Line Android SDK Setup

**Windows:**
```bash
# Download Android SDK Command-line tools from:
# https://developer.android.com/studio#command-tools

# Extract to: C:\Android\cmdline-tools

# Set environment variable ANDROID_HOME
setx ANDROID_HOME "C:\Android"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools"

# Close and reopen Command Prompt, then:
sdkmanager "platforms;android-33"
sdkmanager "build-tools;33.0.0"
sdkmanager "system-images;android-33;default;x86_64"
sdkmanager "emulator"

# Create emulator
avdmanager create avd -n MyEmulator -k "system-images;android-33;default;x86_64"

# Start emulator
emulator -avd MyEmulator
```

**macOS/Linux:**
```bash
# Download and extract Android SDK Command-line tools
mkdir -p ~/Android/cmdline-tools
cd ~/Android/cmdline-tools
# Download and extract here

# Add to ~/.zshrc or ~/.bash_profile
export ANDROID_HOME="$HOME/Android"
export PATH="$PATH:$ANDROID_HOME/platform-tools"
export PATH="$PATH:$ANDROID_HOME/tools"

source ~/.zshrc  # or ~/.bash_profile

# Install packages
sdkmanager "platforms;android-33"
sdkmanager "build-tools;33.0.0"
sdkmanager "system-images;android-33;default;x86_64"
sdkmanager "emulator"

# Create emulator
avdmanager create avd -n MyEmulator -k "system-images;android-33;default;x86_64"

# Start emulator
emulator -avd MyEmulator
```

## Step 3: Set Environment Variables

### Windows (Command Prompt)

```cmd
# Check if ANDROID_HOME exists
echo %ANDROID_HOME%

# If empty, set it
setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"

# Close and reopen Command Prompt to apply changes
```

### Windows (PowerShell)

```powershell
$AndroidSdkPath = "$env:LOCALAPPDATA\Android\Sdk"
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $AndroidSdkPath, "User")

# Close and reopen PowerShell
```

### macOS/Linux

Add to `~/.zshrc` or `~/.bash_profile`:

```bash
export ANDROID_HOME="$HOME/Library/Android/Sdk"
export PATH="$PATH:$ANDROID_HOME/tools"
export PATH="$PATH:$ANDROID_HOME/platform-tools"
export PATH="$PATH:$ANDROID_HOME/emulator"
```

Then run:
```bash
source ~/.zshrc  # or ~/.bash_profile
```

**Verify:**
```bash
echo $ANDROID_HOME
adb version  # Should show version info
```

## Step 4: Install Java Development Kit (JDK)

React Native requires JDK 11 or higher.

### Windows

1. Download JDK 11+ from https://www.oracle.com/java/technologies/downloads/
2. Run installer, accept defaults
3. Note the installation path (usually `C:\Program Files\Java\jdk-11...`)
4. Set `JAVA_HOME`:
```cmd
setx JAVA_HOME "C:\Program Files\Java\jdk-11.0.x"
```

### macOS
```bash
brew install openjdk@11
```

### Linux (Ubuntu/Debian)
```bash
sudo apt install openjdk-11-jdk
```

**Verify:**
```bash
java -version  # Should show v11 or higher
```

## Step 5: Start Android Emulator

### Using Android Studio
1. Open Android Studio
2. Click **Device Manager**
3. Click the **Play** button next to your emulator
4. Wait for emulator to start (1-2 minutes)

### Using Command Line
```bash
emulator -avd MyEmulator
```

### Verify Emulator is Running
```bash
adb devices
# Should show: emulator-5554  device
```

## Step 6: Clone/Extract Project

Navigate to where you want the project:

```bash
cd ~/projects  # or your preferred location
# If downloaded as ZIP
unzip CarRacingGame.zip
cd CarRacingGame
```

## Step 7: Install Project Dependencies

```bash
cd CarRacingGame

# Clean install (recommended)
rm -rf node_modules
npm install
```

**On Windows**, if you get permission errors:
```cmd
npm install --no-optional
```

This will install ~800 packages and take 2-5 minutes.

## Step 8: Create Android Debug Keystore

```bash
cd android/app

# Generate keystore
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"

# Verify
ls debug.keystore  # or: dir debug.keystore (Windows)

cd ../..
```

## Step 9: Configure Metro Bundler

Create `metro.config.js` if not present:

```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

## Step 10: First Build & Run

**Terminal 1 - Start Metro Bundler:**
```bash
npm start
```

You should see:
```
                    Welcome to Metro!
                  Fast - Scalable - Integrated
```

**Terminal 2 (New) - Build & Deploy:**
```bash
npm run android
```

Or alternatively:
```bash
npx react-native run-android
```

**Wait 3-5 minutes for the build to complete.**

You'll see the app launch on your emulator!

## Post-Installation

### Verify Installation
1. App should start to the **Home Screen**
2. Tap **PLAY GAME**
3. Game should start with roads and player car
4. Tap **Pause** - overlay should appear
5. Tap **Resume** - game continues

### If App Doesn't Start

**Error: "Metro server not running"**
```bash
npm start
```

**Error: "Gradle build failed"**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**Error: "Emulator not found"**
```bash
emulator -avd MyEmulator  # Start manually
```

**Error: "ANDROID_HOME not set"**
```bash
# Verify and set ANDROID_HOME
echo %ANDROID_HOME%  # Windows
echo $ANDROID_HOME   # macOS/Linux
```

## Using Physical Android Device

1. **Enable USB Debugging:**
   - Go to Settings
   - Find **Developer Options** (might be under "About Phone" > "Build Number")
   - Enable **USB Debugging**

2. **Connect via USB**
   - Plug in phone via USB cable
   - Allow USB Debugging when prompted on phone

3. **Verify Connection:**
   ```bash
   adb devices
   # Should show your device
   ```

4. **Run App:**
   ```bash
   npm run android
   ```

## Development Commands

```bash
# Start Metro bundler
npm start

# Build and run Android
npm run android

# Run Android with specific device
adb devices  # List devices
npx react-native run-android --active

# Build release APK
cd android
./gradlew assembleRelease
cd ..
# APK: android/app/build/outputs/apk/release/app-release.apk

# View logs
adb logcat

# Clear app data
adb shell pm clear com.carracingame

# Uninstall app
adb uninstall com.carracingame
```

## Troubleshooting Installation

| Issue | Solution |
|-------|----------|
| `node: command not found` | Install Node.js from nodejs.org |
| `ANDROID_HOME not set` | Set environment variables (see Step 3) |
| `No emulator found` | Start emulator or connect physical device |
| `Gradle build failed` | Run `cd android && ./gradlew clean && cd ..` |
| `Out of memory` | Allocate more RAM to emulator |
| `Port 8081 in use` | Kill Metro: `lsof -i :8081` / `kill -9 <PID>` |
| `Bundler crashes` | Run `npm start -- --reset-cache` |

## Performance Optimization

### Android Emulator
- Allocate **4GB+ RAM** to emulator
- Use **x86_64** architecture (faster than ARM)
- Enable **GPU acceleration** in emulator settings
- Close other apps while developing

### Development
- Use `--reset-cache` if changes don't appear
- Clear `node_modules` and reinstall if stuck
- Restart emulator if laggy
- Monitor RAM usage in Android Studio

## Next Steps

1. ✅ Installation complete!
2. 📖 Read `QUICKSTART.md` for quick setup
3. 🎮 Read `README.md` for gameplay details
4. 💻 Explore `src/` folder to understand code structure
5. 🎨 Customize colors, speed, difficulty in `src/constants/`

## Getting Help

1. **React Native Docs**: https://reactnative.dev/docs/getting-started
2. **Android Studio Docs**: https://developer.android.com/studio/intro
3. **Common Issues**: https://reactnative.dev/docs/troubleshooting
4. **Stack Overflow**: Tag questions with `react-native`

---

**Installation complete! Start the game with:**

```bash
npm start      # Terminal 1
npm run android # Terminal 2 (new)
```

Enjoy! 🏎️
