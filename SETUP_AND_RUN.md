# Car Racing Game - Complete Setup & Run Guide

This is a professional 2D Car Racing Game built with React Native CLI (no Expo).

## System Requirements

- **Node.js**: v16 or higher
- **Android SDK**: API 28+ (required for Android development)
- **Android NDK**: Latest version (for native compilation)
- **Java JDK**: 11 or higher
- **Android Emulator** or **Physical Android Device**

---

## Step 1: Prerequisites Setup

### 1.1 Install Node.js
- Download from https://nodejs.org/
- Recommended: LTS version (18+)
- Verify installation:
  ```cmd
  node --version
  npm --version
  ```

### 1.2 Install Android Development Environment

#### Option A: Using Android Studio (Recommended)
1. Download Android Studio from https://developer.android.com/studio
2. During installation:
   - Select "Standard" installation type
   - Install Android SDK (API 33+)
   - Install Android Virtual Device (emulator)
   - Install Android NDK
3. Add to PATH environment variables:
   - `ANDROID_HOME`: Point to your Android SDK location (typically `C:\Users\YourUsername\AppData\Local\Android\Sdk`)
   - `ANDROID_SDK_ROOT`: Same as above
   - `JAVA_HOME`: Point to your Java JDK installation

#### Option B: Command Line Setup
```cmd
# Install JDK
choco install openjdk

# Install Android SDK tools (if using package manager)
choco install android-sdk

# Or manually:
# Download Android Command Line Tools from https://developer.android.com/studio
# Extract and configure ANDROID_HOME
```

### 1.3 Verify Setup
```cmd
# Check Java
java -version

# Check Android
sdkmanager --list

# These commands should work without errors
```

---

## Step 2: Clone/Navigate to Project

```cmd
cd c:\Users\USer\Desktop\Reactnative\ car\ game\CarRacingGame
```

---

## Step 3: Install Dependencies

### 3.1 Clean Previous Installation (if needed)
```cmd
# Remove node modules
rmdir /s /q node_modules

# Clear npm cache
npm cache clean --force

# Remove package-lock.json
del package-lock.json
```

### 3.2 Install Dependencies
```cmd
npm install
```

This will install all required packages:
- `react`: 18.2.0
- `react-native`: 0.73.6
- `@react-navigation/native` and `@react-navigation/stack`
- `@react-native-async-storage/async-storage`
- `react-native-gesture-handler`
- `react-native-reanimated`
- And all development dependencies

### 3.3 Verify Installation
```cmd
# Check if node_modules is populated
dir node_modules | find /c "/d"

# Should show many directories
```

---

## Step 4: Android Setup

### 4.1 Create Android Emulator (if you don't have one)
```cmd
# List available emulators
emulator -list-avds

# If no emulator exists, create one:
# 1. Open Android Studio
# 2. Go to: Tools > AVD Manager
# 3. Click "Create Virtual Device"
# 4. Select: Pixel 4 (or any device)
# 5. Select: API 33 or higher
# 6. Name it: "EmulatorRacingGame" or any name
# 7. Click Finish
```

### 4.2 Start Android Emulator
```cmd
# Use the emulator name from previous step
emulator -avd EmulatorRacingGame

# Or open from Android Studio: Tools > AVD Manager > Play button
# The emulator will take 1-2 minutes to start
```

### 4.3 Verify Device Connection
```cmd
adb devices

# Should show:
# emulator-5554    device
```

---

## Step 5: Build and Run the Game

### 5.1 Start Metro Bundler (in Terminal 1)
```cmd
npm start

# Wait for message: "Welcome to React Native"
# Bundler will listen on port 8081
```

### 5.2 Build and Deploy to Android (in Terminal 2)
```cmd
# Make sure Android Emulator is running from Step 4.2

npm run android
# OR
npx react-native run-android

# This will:
# 1. Build the Android app
# 2. Compile TypeScript
# 3. Generate APK
# 4. Install on emulator
# 5. Launch the game
# Takes 3-5 minutes on first run
```

---

## Step 6: Playing the Game

### Home Screen
- **PLAY GAME**: Start a new game session
- **HIGH SCORES**: View your top 10 scores
- **SETTINGS**: Configure game settings

### Game Screen

#### Controls
- **Swipe Left/Right**: Move car left/right
- **Left/Right Buttons**: Manual movement (bottom of screen)
- **Pause Button**: Pause/Resume game (middle button)

#### Game Mechanics
- **Score**: +1 point per second, +10 per coin
- **Coins**: Collect yellow coins for bonus points
- **Enemy Cars**: Red cars appear and move down - avoid them!
- **Obstacles**: Orange cones - avoid collisions
- **Power-ups**: Blue circles - collect for shield protection
- **Speed**: Increases gradually as you progress
- **Level**: Increases every 1000 points

### Game Over
- Shows final score, coins collected, level reached
- Displays new high score if applicable
- Option to play again or return home

---

## Troubleshooting

### Issue: "adb: command not found"
**Solution**: Add Android SDK tools to PATH:
```cmd
setx PATH "%PATH%;C:\Users\YourUsername\AppData\Local\Android\Sdk\platform-tools"
# Restart terminal after setting PATH
```

### Issue: "Cannot find JAVA_HOME"
**Solution**: Set JAVA_HOME environment variable:
```cmd
setx JAVA_HOME "C:\Program Files\OpenJDK\jdk-11.0.x"
# Restart terminal
```

### Issue: Emulator Won't Start
```cmd
# Check emulator status
emulator -avd EmulatorRacingGame -v -v -v

# Or create new emulator in Android Studio

# If still failing, restart ADB:
adb kill-server
adb start-server
```

### Issue: Build Fails with "FAILURE"
```cmd
# Clean build
cd android
gradlew clean
cd ..

# Try build again
npm run android

# If still fails, check:
# 1. Android SDK installed (API 28+)
# 2. ANDROID_HOME path correct
# 3. Java version is 11+
```

### Issue: "Metro Bundler Connection Timeout"
```cmd
# Kill existing Metro process
taskkill /F /IM node.exe

# Delete cache
npm cache clean --force
del /s /q node_modules\.cache

# Restart
npm start
```

### Issue: Game Crashes on Start
```cmd
# Check logcat
adb logcat *:E

# Clear app data
adb shell pm clear com.carracing.game

# Reinstall
npm run android
```

### Issue: High CPU Usage or Lag
```cmd
# Increase emulator RAM:
# 1. Close emulator
# 2. Edit ~/.android/avd/EmulatorRacingGame.avd/config.ini
# 3. Change: hw.ramSize=2048 (to 4096 or 8192)
# 4. Restart emulator
```

---

## Development Commands

```cmd
# Start metro bundler
npm start

# Run on Android
npm run android

# Lint code
npm run lint

# Run tests
npm run test

# Clear Metro cache
npm start -- --reset-cache

# Check for TypeScript errors
npx tsc --noEmit
```

---

## Project Structure

```
CarRacingGame/
├── src/
│   ├── App.tsx                 # Main app component
│   ├── components/             # Reusable UI components
│   │   ├── PlayerCar.tsx      # Player car with shield
│   │   ├── EnemyCar.tsx       # Enemy car sprite
│   │   ├── Obstacle.tsx       # Road obstacles
│   │   ├── Coin.tsx           # Collectible coins
│   │   ├── PowerUp.tsx        # Power-up items
│   │   ├── Road.tsx           # Road animation
│   │   ├── HUD.tsx            # Score display
│   │   └── GameControls.tsx   # Button controls
│   ├── screens/                # Screen components
│   │   ├── HomeScreen.tsx     # Main menu
│   │   ├── GameScreen.tsx     # Main game
│   │   ├── GameOverScreen.tsx # Game over display
│   │   ├── HighScoresScreen.tsx # High scores list
│   │   └── SettingsScreen.tsx # Settings menu
│   ├── navigation/
│   │   └── RootNavigator.tsx  # Navigation stack
│   ├── constants/
│   │   ├── colors.ts          # Color definitions
│   │   └── gameConfig.ts      # Game settings
│   ├── utils/
│   │   ├── storage.ts         # AsyncStorage handling
│   │   ├── collision.ts       # Collision detection
│   │   └── random.ts          # Random generators
│   └── types/
│       └── index.ts           # TypeScript types
├── android/                    # Android native code
├── package.json               # Dependencies
├── app.json                   # App configuration
├── tsconfig.json              # TypeScript config
├── babel.config.js            # Babel configuration
└── metro.config.js            # Metro bundler config
```

---

## Features Implemented

✅ **Home Screen**
- Play, High Score, Settings buttons
- Display current top score
- Game info and statistics

✅ **Gameplay**
- Endless road animation
- Player car with swipe/button controls
- Enemy cars spawning
- Obstacles (cones)
- Collectible coins
- Power-up shield
- Collision detection
- Speed increases over time
- Level progression

✅ **UI/UX**
- Score tracking
- Coin counter
- Speed display
- Time elapsed
- Pause/Resume functionality
- High score comparison

✅ **Data Persistence**
- High scores saved via AsyncStorage
- Top 10 scores stored locally
- Settings saved (sound, vibration, difficulty)

✅ **Animations & Graphics**
- Smooth road scrolling
- Car sprites with details
- Enemy cars
- Coins with shine effect
- Power-up visual effects
- Shield animation

✅ **Navigation**
- Home → Game → GameOver flow
- High Scores screen
- Settings screen
- Smooth screen transitions

---

## Performance Optimization

- Game loop runs at 30 FPS (30ms updates)
- Efficient collision detection (AABB)
- Object pooling for entities
- Memory-efficient rendering
- Optimized re-renders

---

## Next Steps for Enhancement

1. **Sound Effects**: Add react-native-sound library
2. **Music**: Background music on menus
3. **Leaderboards**: Cloud sync with backend
4. **Multiplayer**: Turn-based or online battles
5. **Graphics**: SVG assets or animations library
6. **Analytics**: Track user behavior
7. **Ads**: Advertisement integration
8. **Themes**: Dark/Light mode toggle

---

## Support & Documentation

- **React Native Docs**: https://reactnative.dev/
- **React Navigation**: https://reactnavigation.org/
- **AsyncStorage**: https://react-native-async-storage.github.io/async-storage/
- **Android Studio**: https://developer.android.com/studio

---

## License

This is a sample project for learning React Native game development.

---

## Quick Start Checklist

- [ ] Node.js v16+ installed
- [ ] Android SDK configured
- [ ] ANDROID_HOME set in PATH
- [ ] Java JDK 11+ installed
- [ ] Android Emulator created
- [ ] npm install completed
- [ ] Metro bundler started (npm start)
- [ ] Emulator running
- [ ] npx react-native run-android executed
- [ ] Game loaded successfully

Good luck! 🎮
