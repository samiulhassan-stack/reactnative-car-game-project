# Quick Start Guide 🚀

Get the Car Racing Game running in 5 minutes!

## Prerequisites

- **Node.js** v16+ installed
- **Android SDK** installed
- **Android Emulator** running (or Android device connected)

## Installation (3 Steps)

### 1. Install Dependencies

```bash
cd CarRacingGame
npm install
```

Wait for all packages to install. This may take 2-3 minutes.

### 2. Create Android Debug Keystore

```bash
cd android/app
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
cd ../..
```

Press Enter for any prompts to use default values.

### 3. Start the Metro Bundler

```bash
npm start
```

Leave this terminal running.

## Running the App

### Open a New Terminal

In a **new terminal window**, run:

```bash
npm run android
```

The app will build and deploy to your Android emulator/device!

**Wait 2-3 minutes for the build to complete. You'll see the game launch on your emulator.**

## First Launch Tips

1. **Splash Screen**: You'll see the app initializing (normal)
2. **Home Screen**: Tap **PLAY GAME** to start
3. **Game Screen**: 
   - Swipe left/right to move the car
   - Tap pause button to pause
   - Avoid red cars and obstacles
   - Collect gold coins

## What to Expect

### Home Screen
- Title and high score display
- Play Game button
- High Scores and Settings links
- Game statistics

### Gameplay
- Road scrolling continuously
- Enemy cars spawning randomly
- Obstacles to avoid
- Coins to collect
- Score and level display
- Speed increases over time

### Game Over
- Final score and stats
- High score comparison
- Option to play again or go home

## Troubleshooting

### Metro won't start
```bash
npm start -- --reset-cache
```

### App won't build
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Emulator issues
```bash
# Stop current emulator
adb emu kill

# Or kill all ADB processes
taskkill /F /IM adb.exe  # Windows
killall adb              # macOS/Linux

# Start emulator again
emulator -avd MyEmulator
```

## File Structure

The important folders:
- `src/screens/` - Game screens (Home, Game, GameOver, etc.)
- `src/components/` - Reusable UI components (Cars, coins, etc.)
- `src/constants/` - Game settings and configuration
- `src/utils/` - Helper functions (collision, storage)
- `android/` - Native Android configuration

## Next Steps

1. **Customize the game**: Edit `src/constants/gameConfig.ts`
2. **Change colors**: Edit `src/constants/colors.ts`
3. **Modify difficulty**: Adjust spawn rates and speed
4. **Add sounds**: Implement audio in `GameScreen.tsx`

## Common Commands

```bash
# Start the game
npm run android

# Start with reset cache
npm start -- --reset-cache

# Build release APK
cd android && ./gradlew assembleRelease

# Clean everything
rm -rf node_modules android/app/build
npm install

# Check for TypeScript errors
npm run lint
```

## Game Controls

| Action | Control |
|--------|---------|
| Move Left | Swipe Left / Tap Left Button |
| Move Right | Swipe Right / Tap Right Button |
| Pause | Tap Pause Button |
| Resume | Tap Play Button |
| Collect Coin | Crash into yellow coin |
| Avoid Obstacle | Don't hit cones/rocks |
| Use Power-up | Crash into power-up circle |

## Performance Tips

- If lagging, close other apps
- Ensure emulator has enough RAM allocated
- Use hardware acceleration if available
- Check that Metro bundler is running

## Support Resources

- React Native Docs: https://reactnative.dev
- Android Emulator: https://developer.android.com/studio/run/emulator
- React Navigation: https://reactnavigation.org

## Common Questions

**Q: Can I run this on iPhone?**
A: No, this requires iOS SDK. Stick to Android for now.

**Q: How do I change the game speed?**
A: Edit `src/constants/gameConfig.ts` and modify `INITIAL_GAME_SPEED`.

**Q: Can I run this on a physical device?**
A: Yes! Enable USB debugging on your Android phone and run `npm run android`.

**Q: How long do builds take?**
A: First build: 3-5 minutes. Subsequent builds: 30 seconds - 2 minutes.

**Q: Where are high scores saved?**
A: In the device's secure storage using AsyncStorage (survives app restart).

---

**You're all set! Enjoy the game! 🏎️**

Have fun and feel free to modify the code to create your own version!
