# Car Racing Game 🏎️

A professional 2D car racing game built with React Native CLI and JavaScript. The game features endless road animation, player car controls, enemy cars, obstacles, coin collection, power-ups, and a complete game progression system.

## Features ✨

- **Home Screen**: Play, High Scores, and Settings menu
- **Endless Road Animation**: Continuously scrolling road with lane markers
- **Player Car Controls**: Swipe left/right or button controls
- **Enemy Cars**: Dynamically spawned enemy vehicles to avoid
- **Obstacles**: Various obstacles to dodge for extra points
- **Coin Collection**: Collect coins for bonus points
- **Power-ups**: Shield, Speed Boost, and Fuel power-ups
- **Collision Detection**: Accurate bounding box collision detection
- **Game Progression**: Level increases with score, difficulty scales
- **Pause/Resume**: Pause the game during gameplay
- **Game Over Screen**: Final stats and option to restart
- **High Scores**: Top 10 scores saved with AsyncStorage
- **Settings**: Audio, vibration, and difficulty options
- **Smooth Animations**: 60 FPS game loop with responsive UI
- **Production Quality Code**: Well-commented, typed with TypeScript, reusable components

## Tech Stack

- **React Native**: Cross-platform mobile framework
- **React Native CLI**: Native development without Expo
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
- **React Native Reanimated**: Advanced animations
- **AsyncStorage**: Persistent data storage
- **Android Native**: Fully native Android support

## Project Structure

```
CarRacingGame/
├── android/                    # Android native configuration
│   ├── app/
│   │   └── src/main/
│   │       ├── java/           # Java Android code
│   │       └── AndroidManifest.xml
│   ├── build.gradle
│   └── settings.gradle
├── src/
│   ├── components/             # React components
│   │   ├── PlayerCar.tsx
│   │   ├── EnemyCar.tsx
│   │   ├── Obstacle.tsx
│   │   ├── Coin.tsx
│   │   ├── PowerUp.tsx
│   │   ├── Road.tsx
│   │   ├── HUD.tsx
│   │   ├── GameControls.tsx
│   │   └── index.ts
│   ├── screens/                # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── GameScreen.tsx
│   │   ├── GameOverScreen.tsx
│   │   ├── HighScoresScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── index.ts
│   ├── navigation/             # Navigation setup
│   │   └── RootNavigator.tsx
│   ├── constants/              # Game constants
│   │   ├── colors.ts
│   │   ├── gameConfig.ts
│   │   └── index.ts
│   ├── utils/                  # Utility functions
│   │   ├── storage.ts          # AsyncStorage utilities
│   │   ├── collision.ts        # Collision detection
│   │   ├── random.ts           # Random generators
│   │   └── index.ts
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   └── App.tsx                 # Main App component
├── index.js                    # Entry point
├── app.json                    # App configuration
├── package.json                # NPM dependencies
├── tsconfig.json               # TypeScript configuration
├── babel.config.js             # Babel configuration
├── metro.config.js             # Metro bundler config
├── .eslintrc.js                # ESLint configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## Installation & Setup

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Android SDK** (for Android development)
- **Android Emulator** or physical Android device
- **Java Development Kit (JDK)** (v11 or higher)

### Step 1: Install Dependencies

```bash
cd CarRacingGame
npm install
```

### Step 2: Install Android Specific Dependencies

```bash
npm install react-native-gesture-handler react-native-reanimated @react-navigation/native @react-navigation/stack @react-native-async-storage/async-storage
```

### Step 3: Set Up Android Environment Variables

Set the `ANDROID_HOME` environment variable:

**Windows (Command Prompt):**
```cmd
setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
```

**Windows (PowerShell):**
```powershell
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")
```

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Library/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Step 4: Create Android Debug Keystore

```bash
cd android/app
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
cd ../..
```

If you prefer a pre-built keystore, you can skip this step as the project includes configuration for it.

## Running the App

### Start the Metro Bundler (Terminal 1)

```bash
npm start
```

You should see output indicating the Metro bundler is running.

### Run on Android Emulator (Terminal 2)

**Make sure an Android Emulator is running first:**

```bash
# List available emulators
emulator -list-avds

# Start an emulator
emulator -avd <emulator_name>
```

Then run:

```bash
npm run android
```

Or:

```bash
npx react-native run-android
```

### Run on Physical Android Device

Connect your Android device via USB and enable USB debugging:

1. Go to **Settings > Developer Options**
2. Enable **USB Debugging**
3. Connect device to computer
4. Run:

```bash
npm run android
```

## Build for Release

To build a release APK:

```bash
cd android
./gradlew assembleRelease
```

The APK will be located at: `android/app/build/outputs/apk/release/app-release.apk`

## Game Controls

### Mobile Controls
- **Swipe Left/Right**: Move player car left or right
- **Tap Buttons**: Left/Right buttons at the bottom
- **Pause Button**: Center button to pause/resume game

### Gameplay Tips
1. **Avoid Collisions**: Dodge enemy cars and obstacles
2. **Collect Coins**: Pick up coins for bonus points
3. **Use Power-ups**: Shield protects you from one collision
4. **Watch Speed**: Game speed increases with score and level
5. **Pause Strategically**: Use pause for quick breaks

## Game Mechanics

### Scoring System
- **1 point**: Per second alive
- **10 points**: Per coin collected
- **50 points**: Per obstacle avoided
- **Bonus**: Level multiplier after 1000 points

### Game Speed
- Starts at 8 pixels/frame
- Increases with score progression
- Maximum speed: 20 pixels/frame
- Speed increases gradually over time

### Difficulty Levels
- **Easy**: Slower spawn rates, lower speeds
- **Normal**: Balanced gameplay (default)
- **Hard**: Faster enemies, more obstacles

### Power-ups
- **Shield**: Protects from one collision, 10 second duration
- **Speed Boost**: Increases player speed temporarily
- **Fuel**: Restores health/energy

### Enemy AI
- Enemy cars spawn randomly across road lanes
- Spawn rate increases with level
- Movement is continuous downward
- Removed when off-screen

## Data Persistence

High scores and settings are saved using **AsyncStorage**:
- **Top 10 scores**: Saved with date and level
- **Settings**: Audio, vibration, difficulty preferences
- **Last played**: Score and level from last session

Data persists across app sessions and device restarts.

## Customization

### Adjust Game Speed

Edit `src/constants/gameConfig.ts`:

```typescript
INITIAL_GAME_SPEED: 8,      // Starting speed
MAX_GAME_SPEED: 20,         // Maximum speed
SPEED_INCREMENT: 0.001,     // Speed increase per frame
```

### Change Colors

Edit `src/constants/colors.ts`:

```typescript
primary: '#FF6B6B',          // Main accent color
carPlayer: '#FF6B6B',        // Player car color
carEnemy: '#FF1744',         // Enemy car color
```

### Adjust Spawn Rates

Edit `src/constants/gameConfig.ts`:

```typescript
ENEMY_SPAWN_INTERVAL: 2000,      // Enemy spawn time (ms)
OBSTACLE_SPAWN_INTERVAL: 3000,   // Obstacle spawn time (ms)
COIN_SPAWN_INTERVAL: 1500,       // Coin spawn time (ms)
POWERUP_SPAWN_INTERVAL: 5000,    // Power-up spawn time (ms)
```

## Troubleshooting

### Metro Bundler Won't Start

```bash
# Clear cache and restart
npm start -- --reset-cache
```

### Build Fails

```bash
# Clean build directories
cd android
./gradlew clean
cd ..
npm run android
```

### Emulator Not Found

```bash
# List available emulators
emulator -list-avds

# Create new emulator if needed
avdmanager create avd -n MyEmulator -k "system-images;android-33;default;x86_64"
```

### Gradle Build Issues

```bash
# Update gradle
cd android
./gradlew wrapper --gradle-version 8.1.1
cd ..
```

## Performance Optimization

- Game loop runs at 60 FPS
- Efficient collision detection with bounding boxes
- Object pooling for game entities
- Minimal re-renders using React optimization
- Native Android rendering for smooth performance

## Browser Compatibility

This app runs **only on Android** using React Native CLI. It does not support:
- Web browsers (requires React Native Web)
- iOS (requires iOS SDK)
- Expo Managed Workflow

## API Reference

### Game Configuration
See `src/constants/gameConfig.ts` for all adjustable parameters.

### Collision Detection
```typescript
checkCollision(box1: BoundingBox, box2: BoundingBox): boolean
isOutOfBounds(entity: BoundingBox): boolean
```

### Storage Utilities
```typescript
getHighScores(): Promise<HighScoreData[]>
saveHighScore(score: HighScoreData): Promise<void>
getTopScore(): Promise<number>
getSettings(): Promise<GameSettings>
saveSettings(settings: GameSettings): Promise<void>
```

## Future Enhancements

- Sound effects and background music
- More obstacle types
- Additional power-up varieties
- Leaderboard with cloud sync
- Achievements/Badges system
- Multiplayer modes
- Different car skins
- Track customization

## License

This project is provided as-is for educational and development purposes.

## Contributing

Feel free to fork, modify, and improve this game!

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Ensure all dependencies are properly installed
4. Clear cache and rebuild

---

**Made with ❤️ using React Native**

Happy gaming! 🏎️💨
