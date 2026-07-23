# 🚀 Getting Started - Car Racing Game

Welcome! This guide will walk you through setting up and running the Car Racing Game on your machine.

## 📋 Prerequisites Checklist

Before you start, make sure you have:

- [ ] **Windows 10/11** operating system
- [ ] **Internet connection** (for downloading dependencies)
- [ ] **8GB+ RAM** (for Android emulator)
- [ ] **20GB+ free disk space** (for Android SDK and emulator)

---

## ✅ Step 1: Install Node.js

Node.js includes npm (Node Package Manager), which is required to install project dependencies.

### Download & Install
1. Go to https://nodejs.org/
2. Download the **LTS version** (Long Term Support)
3. Run the installer and follow the prompts
4. During installation, enable **Add to PATH** option

### Verify Installation
Open Command Prompt and run:
```cmd
node --version
npm --version
```

You should see version numbers. Example:
```
v18.17.0
9.8.1
```

---

## ✅ Step 2: Install Java Development Kit (JDK)

React Native requires Java to build Android apps.

### Option A: Automatic (Recommended)
If you have **Chocolatey** installed:
```cmd
choco install openjdk
```

### Option B: Manual Installation
1. Go to https://www.oracle.com/java/technologies/downloads/
2. Download **Java SE 11** or higher
3. Run the installer and follow prompts
4. Remember the installation path (e.g., `C:\Program Files\Java\jdk-11.x.x`)

### Verify Installation
```cmd
java -version
```

You should see Java version information.

### Set JAVA_HOME (if not automatically set)
1. Right-click **This PC** → **Properties**
2. Click **Advanced system settings**
3. Click **Environment Variables**
4. Click **New** under System variables
5. Variable name: `JAVA_HOME`
6. Variable value: `C:\Program Files\Java\jdk-11.x.x` (adjust path to your installation)
7. Click OK and restart your terminal

---

## ✅ Step 3: Install Android Studio

Android Studio includes the Android SDK, NDK, and emulator needed to run the game.

### Download & Install
1. Go to https://developer.android.com/studio
2. Download **Android Studio**
3. Run the installer

### Initial Setup
When Android Studio launches for the first time:
1. Click **Next** on the welcome screen
2. Select **Standard** installation type
3. Accept the license agreements
4. Click **Finish** and wait for components to download

This downloads:
- Android SDK (API 28+)
- Android NDK
- Android Emulator
- Other tools

### Set ANDROID_HOME

After Android Studio finishes installing:

1. Open **Command Prompt** as Administrator
2. Run these commands:

```cmd
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
setx ANDROID_SDK_ROOT "%LOCALAPPDATA%\Android\Sdk"
```

3. Close and reopen Command Prompt to apply changes
4. Verify:
```cmd
echo %ANDROID_HOME%
```

You should see the Android SDK path.

---

## ✅ Step 4: Create an Android Emulator

The emulator simulates an Android phone on your computer.

### Create Virtual Device
1. Open **Android Studio**
2. Go to **Tools** → **AVD Manager** (or **Device Manager** in newer versions)
3. Click **Create Virtual Device**
4. Select **Pixel 4** or **Pixel 5** (recommended)
5. Click **Next**
6. Select **Android 13** or higher (API 33+)
7. Click **Next** and then **Finish**

The emulator will be created and available in the list.

### Test the Emulator
1. In AVD Manager, click the **Play button** next to your emulator
2. Wait 2-3 minutes for it to fully start
3. You should see an Android home screen

---

## ✅ Step 5: Project Setup

Navigate to your project and install dependencies.

### Open Terminal/Command Prompt
```cmd
cd c:\Users\USer\Desktop\Reactnative\ car\ game\CarRacingGame
```

### Install Dependencies
```cmd
npm install
```

This installs all required packages. It may take 5-10 minutes on first run.

### Verify Installation
```cmd
npm list react react-native
```

You should see version information without errors.

---

## 🎮 Step 6: Run the Game

### Method 1: Quick Start Script (Easiest)

**Windows Command Prompt:**
```cmd
START_GAME.bat
```

**Windows PowerShell:**
```powershell
.\START_GAME.ps1
```

This script will:
1. Check dependencies
2. Start Metro bundler
3. Build and run the game on emulator

### Method 2: Manual Steps

**Terminal 1: Start Metro Bundler**
```cmd
npm start
```

Wait for the message "Welcome to React Native". The bundler will listen on port 8081.

**Terminal 2: Build and Run**
```cmd
npm run android
```

Or:
```cmd
npx react-native run-android
```

**First build takes 3-5 minutes.** Subsequent builds are faster.

---

## 🎯 First Run Checklist

After the game launches, verify everything works:

- [ ] Home screen appears with "Car Racing Game" title
- [ ] "PLAY GAME" button is visible
- [ ] "HIGH SCORES" button works
- [ ] "SETTINGS" button works
- [ ] Click "PLAY GAME" to start
- [ ] Player car is visible at bottom center
- [ ] Road scrolls downward
- [ ] Red enemy cars appear
- [ ] Orange cones appear as obstacles
- [ ] Yellow coins appear
- [ ] Swipe controls work (move car left/right)
- [ ] Left/Right buttons work
- [ ] Pause button pauses the game
- [ ] Game over works after collision
- [ ] High score is saved
- [ ] Can replay game

If all checks pass, congratulations! 🎉

---

## 🆘 Troubleshooting

### Issue: "npm: command not found"
**Solution:** 
- Install Node.js from https://nodejs.org/
- Make sure "Add to PATH" option is selected during installation
- Restart your terminal/computer

### Issue: "adb: command not found"
**Solution:**
```cmd
setx PATH "%PATH%;C:\Users\%USERNAME%\AppData\Local\Android\Sdk\platform-tools"
```
Restart Command Prompt after running this.

### Issue: "JAVA_HOME not found"
**Solution:**
```cmd
setx JAVA_HOME "C:\Program Files\Java\jdk-11.x.x"
```
Replace `jdk-11.x.x` with your actual JDK version.
Restart Command Prompt.

### Issue: No Android Emulator available
**Solution:**
1. Open Android Studio
2. Go to Tools → AVD Manager
3. Click "Create Virtual Device"
4. Follow the on-screen instructions
5. Wait for emulator to be created

### Issue: Emulator won't start
**Solution:**
```cmd
# Kill existing emulator
adb kill-server

# Restart ADB
adb start-server

# List available emulators
emulator -list-avds

# Start emulator
emulator -avd <name>
```

### Issue: Build fails with Gradle error
**Solution:**
```cmd
cd android
gradlew clean
cd ..
npm run android
```

### Issue: Metro bundler "Cannot find module"
**Solution:**
```cmd
# Clear cache
npm cache clean --force

# Delete node_modules
rmdir /s /q node_modules

# Reinstall
npm install

# Retry
npm start
```

### Issue: Game crashes immediately
**Solution:**
```cmd
# Clear app cache
adb shell pm clear com.carracing.game

# Check logs
adb logcat *:E

# Reinstall
npm run android
```

### Issue: Slow/laggy gameplay
**Solution:**
1. Close emulator
2. Edit: `~/.android/avd/[EmulatorName].avd/config.ini`
3. Find: `hw.ramSize=2048`
4. Change to: `hw.ramSize=4096` (or higher)
5. Restart emulator

---

## 📱 Playing the Game

### Home Screen
- **🎮 PLAY GAME**: Start new game
- **🏆 HIGH SCORES**: View top scores
- **⚙️ SETTINGS**: Configure options

### Game Controls
- **Swipe Left/Right**: Move car
- **Left/Right Buttons**: Alternative controls
- **Pause Button**: Pause/resume game

### Game Objectives
- Avoid red enemy cars
- Dodge orange obstacles
- Collect yellow coins (+10 points each)
- Grab blue shields (one-time protection)
- Survive as long as possible
- Beat your high score

### Scoring
| Action | Points |
|--------|--------|
| Per second alive | 1 |
| Collect coin | 10 |
| Reach new level | Bonus |

### Game Progression
- Level 1: 0-999 points
- Level 2: 1000-1999 points
- Level 3+: Continues increasing
- Game speeds up with each level

---

## 💾 Data Persistence

Your progress is automatically saved:
- **High Scores**: Top 10 saved locally
- **Settings**: Audio, vibration, difficulty
- **Last Played**: Previous game stats

Data persists even after closing the app.

---

## 🔧 Development Commands

```cmd
# Start development server
npm start

# Build and run on Android
npm run android

# Lint code (check for errors)
npm run lint

# Run tests
npm run test

# Clear cache and restart
npm start -- --reset-cache

# Check TypeScript errors
npx tsc --noEmit
```

---

## 📚 Useful Resources

- **React Native Docs**: https://reactnative.dev/
- **React Navigation**: https://reactnavigation.org/
- **Android Studio Docs**: https://developer.android.com/studio
- **Node.js**: https://nodejs.org/

---

## 🎓 Next Steps

Once you've got the game running:

1. **Explore the Code**: Check out `src/` folder
2. **Read Comments**: Each file has detailed comments
3. **Customize Settings**: Edit `src/constants/gameConfig.ts`
4. **Change Colors**: Edit `src/constants/colors.ts`
5. **Add Features**: Extend the game with your own ideas

---

## 🤝 Support

If you encounter issues:

1. **Check Troubleshooting** section above
2. **Verify all prerequisites** are installed correctly
3. **Clear caches and rebuild**: 
   ```cmd
   npm cache clean --force
   rmdir /s /q node_modules
   npm install
   npm start -- --reset-cache
   npm run android
   ```
4. **Review documentation** in project folder
5. **Check React Native docs**: https://reactnative.dev/

---

## ✨ Features to Explore

The game includes:
- ✅ Full gameplay with physics
- ✅ High score system
- ✅ Settings menu
- ✅ Power-ups
- ✅ Collision detection
- ✅ Progressive difficulty
- ✅ Smooth animations
- ✅ Data persistence

---

## 🚀 Ready to Play?

You're all set! 

- **Windows CMD**: `START_GAME.bat`
- **Windows PowerShell**: `.\START_GAME.ps1`
- **Manual**: `npm start` then `npm run android`

Good luck, and enjoy the game! 🏁🎮

---

**Last Updated**: 2024
**Created with**: React Native CLI
**Game Engine**: Custom TypeScript/JavaScript
