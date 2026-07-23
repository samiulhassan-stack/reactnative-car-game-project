# Troubleshooting Guide

Common issues and solutions for the Car Racing Game.

## Installation Issues

### "node: command not found"

**Cause:** Node.js not installed or not in PATH

**Solution:**
1. Download Node.js from https://nodejs.org
2. Install with default options
3. Restart terminal/IDE
4. Verify: `node --version`

---

### "npm ERR! code EACCES"

**Cause:** Permission denied installing packages

**Solution (Windows):**
```cmd
npm install --no-optional
npm install -g windows-build-tools
```

**Solution (macOS/Linux):**
```bash
sudo npm install -g
# Or use nvm instead of sudo
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
npm install
```

---

### "ANDROID_HOME not set"

**Cause:** Android SDK path not configured

**Solution (Windows - Command Prompt):**
```cmd
setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
# Close and reopen cmd
echo %ANDROID_HOME%
```

**Solution (Windows - PowerShell):**
```powershell
$AndroidSdk = "$env:LOCALAPPDATA\Android\Sdk"
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $AndroidSdk, "User")
# Close and reopen PowerShell
```

**Solution (macOS):**
```bash
echo 'export ANDROID_HOME=$HOME/Library/Android/Sdk' >> ~/.zshrc
source ~/.zshrc
echo $ANDROID_HOME
```

**Solution (Linux):**
```bash
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
source ~/.bashrc
echo $ANDROID_HOME
```

---

### "JAVA_HOME not set"

**Cause:** JDK path not configured

**Solution (Windows - Command Prompt):**
```cmd
setx JAVA_HOME "C:\Program Files\Java\jdk-11.x.x"
echo %JAVA_HOME%
```

**Solution (macOS):**
```bash
/usr/libexec/java_home  # Find path
echo 'export JAVA_HOME=$(/usr/libexec/java_home)' >> ~/.zshrc
source ~/.zshrc
```

**Solution (Linux):**
```bash
sudo update-alternatives --config java  # Find path
echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> ~/.bashrc
source ~/.bashrc
```

---

### "No emulator found"

**Cause:** Android Emulator not running

**Solution - Android Studio:**
1. Open Android Studio
2. Click **Device Manager**
3. Click **Play** button next to device
4. Wait for emulator to boot (1-2 minutes)

**Solution - Command Line:**
```bash
emulator -list-avds  # List emulators

# Create if none exist
avdmanager create avd -n MyEmulator -k "system-images;android-33;default;x86_64"

# Start emulator
emulator -avd MyEmulator
```

**Solution - USB Device:**
```bash
adb devices  # List connected devices

# If device not showing, try:
adb kill-server
adb start-server
adb devices
```

---

## Build Issues

### "Gradle build failed"

**Cause:** Build cache corrupted or dependencies not downloaded

**Solution:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**For persistent issues:**
```bash
rm -rf android/app/build
rm -rf android/build
rm -rf node_modules
npm install
npm run android
```

---

### "./gradlew: permission denied"

**Cause:** Script doesn't have execute permission (macOS/Linux)

**Solution:**
```bash
chmod +x android/gradlew
npm run android
```

---

### "Execution failed for task ':app:processDebugResources'"

**Cause:** Resource conflict or build cache issue

**Solution:**
```bash
cd android
./gradlew clean
./gradlew assembleDebug
cd ..
```

---

### "Java version mismatch"

**Cause:** Wrong Java version or not detected

**Solution:**
```bash
# Check current Java
java -version

# Should be 11+. If not:
# Windows: Install JDK 11+ from oracle.com
# macOS: brew install openjdk@11
# Linux: sudo apt install openjdk-11-jdk

# Set default Java
sudo update-alternatives --config java  # Linux/macOS
```

---

### "Dependency resolution failed"

**Cause:** Network issue or wrong Maven repo

**Solution:**
```bash
npm cache clean --force
npm install
cd android
./gradlew build --refresh-dependencies
```

---

## Runtime Issues

### App crashes on startup

**Cause:** JavaScript error or native module issue

**Solution:**
```bash
# Clear all caches
npm start -- --reset-cache

# In separate terminal
npm run android
```

**Check Metro logs:**
```bash
npm start  # Look for red errors in output
```

---

### "Metro server not running"

**Cause:** Metro was not started

**Solution:**
```bash
# Terminal 1
npm start

# Wait for "Welcome to Metro"
# Then in Terminal 2
npm run android
```

---

### App won't update after code changes

**Cause:** Metro bundler cache not refreshed

**Solution:**
```bash
# Stop Metro (Ctrl+C)
# Clear cache
npm start -- --reset-cache

# Then run again in new terminal
npm run android
```

---

### "Port 8081 already in use"

**Cause:** Another Metro server running

**Solution (Windows):**
```cmd
netstat -ano | findstr :8081
taskkill /PID <PID> /F
npm start
```

**Solution (macOS/Linux):**
```bash
lsof -i :8081
kill -9 <PID>
npm start
```

---

### App freezes or lags

**Cause:** Too many entities or inefficient rendering

**Solution:**
1. **Reduce spawn rates:**
   ```typescript
   // src/constants/gameConfig.ts
   ENEMY_SPAWN_INTERVAL: 3000  // Increase value
   ```

2. **Lower max speed:**
   ```typescript
   MAX_GAME_SPEED: 15  // Decrease from 20
   ```

3. **Allocate more RAM to emulator:**
   - Android Studio > Device Manager > Edit > Show Advanced Settings
   - Increase RAM to 4GB+

4. **Close other apps**

---

### "Cannot find symbol: MainActivity"

**Cause:** Java code not properly generated

**Solution:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

---

## Game Issues

### Controls don't respond

**Cause:** Touch events not registered

**Solution:**
1. Try tapping on different screen areas
2. Restart the app
3. Try swiping instead of buttons
4. Check emulator settings

---

### High scores not saving

**Cause:** AsyncStorage not initialized or permission issue

**Solution:**
```bash
# Clear app data
adb shell pm clear com.carracingame

# Reinstall app
npm run android
```

---

### Game speed too fast/slow

**Adjust in** `src/constants/gameConfig.ts`:
```typescript
INITIAL_GAME_SPEED: 8,        // Lower = slower start
MAX_GAME_SPEED: 20,           // Lower = slower max
SPEED_INCREMENT: 0.001,       // Lower = slower increase
```

---

### Collision detection not working

**Check:**
1. Verify collision threshold: `COLLISION_THRESHOLD: 30`
2. Test with simple shapes first
3. Enable collision debug (add outline)
4. Check entity positions are correct

**Debug:**
```typescript
// Add to GameScreen.tsx for debugging
console.log('Player position:', playerX, playerY);
console.log('Enemy position:', enemy.x, enemy.y);
console.log('Collision?', checkCollision(playerBox, enemyBox));
```

---

### Enemies spawn in wrong lane

**Cause:** Road position calculation error

**Solution - Verify in** `src/constants/gameConfig.ts`:
```typescript
ROAD_WIDTH: screenWidth * 0.8,      // Should be 80% of screen
ROAD_LEFT_OFFSET: screenWidth * 0.1, // Should be 10% from left
```

---

## Performance Issues

### Game uses too much battery

**Solution:**
1. **Reduce frame rate:** Lower spawn rates
2. **Lower graphics:** Reduce particle effects
3. **Enable power saving mode** on device

---

### App uses too much memory

**Solution:**
```typescript
// Clear unused entities more aggressively
setEnemyCars(prev => prev.filter(e => !isOutOfBounds(e)));

// Limit maximum entities
if (enemies.length > 30) {
  removeOldestEnemy();
}
```

---

### FPS drops when many entities on screen

**Solution:**
1. Use `React.memo()` for components
2. Implement object pooling
3. Reduce spawn rates
4. Limit collision checks

---

## AndroidManifest Issues

### App won't install

**Cause:** Manifest configuration error

**Solution - Check** `android/app/src/main/AndroidManifest.xml`:
```xml
<!-- Should have required permissions -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Activity should be defined -->
<activity android:name=".MainActivity" />
```

---

## Data Persistence Issues

### Settings/High scores not persisting

**Cause:** AsyncStorage not working

**Solution:**
1. **Clear app data:**
   ```bash
   adb shell pm clear com.carracingame
   ```

2. **Reinstall app:**
   ```bash
   npm run android
   ```

3. **Check AsyncStorage initialization:**
   ```typescript
   // src/utils/storage.ts
   // Verify try-catch blocks
   ```

---

## Emulator Specific Issues

### Emulator runs very slowly

**Solution:**
1. **Enable hardware acceleration:**
   - Device Manager > Edit > GPU: Hardware
2. **Increase RAM:**
   - Device Manager > Edit > RAM: 4GB+
3. **Use x86_64 architecture** (faster than ARM)
4. **Close unnecessary apps** on host machine

---

### Emulator won't start

**Solution:**
```bash
# Kill any existing processes
adb kill-server

# Try to start emulator again
emulator -avd MyEmulator

# If still fails, wipe emulator
emulator -avd MyEmulator -wipe-data
```

---

### Emulator camera/audio issues

**Note:** Not needed for this game, but if affecting performance:
```bash
emulator -avd MyEmulator -feature -Camera,-AudioInput
```

---

## Network/ADB Issues

### "Device offline" or "Unauthorized"

**Cause:** ADB connection issue

**Solution:**
```bash
adb kill-server
adb start-server
adb devices  # Should prompt on device
# Accept USB debugging on device
adb devices  # Should show device
```

---

### Multiple devices connected

**Deploy to specific device:**
```bash
adb devices  # Note device ID (e.g., emulator-5554)
adb -s emulator-5554 shell  # Test connection
npx react-native run-android --deviceId emulator-5554
```

---

## Development/Debugging

### Want to see app logs

```bash
# All logs
adb logcat

# Filtered logs
adb logcat | grep "CarRacingGame"

# Or in Android Studio: View > Tool Windows > Logcat
```

---

### Want to profile performance

**In Android Studio:**
1. View > Tool Windows > Profiler
2. Select your app
3. Monitor CPU, Memory, Network, GPU

---

### Want to debug JavaScript

```bash
# Metro console shows JS errors
npm start

# Also check browser DevTools (if available)
# or use React Native Debugger
npm install -g react-native-debugger
react-native-debugger
```

---

## Clean Build Procedure

If everything fails, try complete clean:

```bash
# Stop all processes
# Terminal 1: Ctrl+C to stop Metro
# Close emulator

# Clean everything
rm -rf node_modules android/app/build android/build
npm cache clean --force
npm install

# Setup keystore again (if needed)
cd android/app
keytool -genkey -v -keystore debug.keystore -storepass android \
  -alias androiddebugkey -keypass android -keyalg RSA \
  -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
cd ../..

# Start fresh
npm start    # Terminal 1
npm run android  # Terminal 2 (after Metro ready)
```

---

## Still Having Issues?

1. **Check the logs carefully** - Error messages often contain solutions
2. **Google the error message** - Likely others have faced it
3. **Check React Native docs** - https://reactnative.dev/docs/troubleshooting
4. **Ask on Stack Overflow** - Tag with `react-native` and `android`
5. **Check GitHub Issues** - Search React Native or React Navigation repos

---

## Reporting Issues

When reporting issues, include:
- ✅ Complete error message
- ✅ Steps to reproduce
- ✅ System info (OS, Node version, Java version)
- ✅ Full Metro/Gradle output
- ✅ Device/Emulator info
- ✅ Recent changes made

---

**Remember:** Most issues are solvable! Take a deep breath and work through the steps methodically. 🚀
