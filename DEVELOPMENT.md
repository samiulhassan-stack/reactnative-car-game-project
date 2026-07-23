# Development Guide

Tips, tricks, and guides for modifying and extending the Car Racing Game.

## Code Overview

### Architecture

```
Game Flow:
Home Screen → Game Screen → Game Over Screen
    ↓           ↓               ↓
  Menu      Game Loop      Final Stats
             ↓
        Pause Overlay
```

### Key Components

**GameScreen.tsx** - Main game loop:
1. Initialize game state
2. Run game update loop (30ms interval)
3. Update entities (enemies, coins, obstacles)
4. Check collisions
5. Update score
6. Detect game over

**Collision Detection** - AABB (Axis-Aligned Bounding Box):
- Checks rectangular overlaps
- Optimized for mobile performance
- Used for all entity collisions

**Entity Spawning** - Time-based spawning:
- Enemies: Every 2000ms (decreases with level)
- Obstacles: Every 3000ms
- Coins: Every 1500ms
- Power-ups: Every 5000ms (level 2+)

## Customization Guide

### 1. Change Game Speed

**File:** `src/constants/gameConfig.ts`

```typescript
// Adjust starting speed
INITIAL_GAME_SPEED: 8,        // Default: 8 (lower = slower)

// Adjust max speed
MAX_GAME_SPEED: 20,           // Default: 20

// Adjust speed increment
SPEED_INCREMENT: 0.001,       // Default: 0.001 (lower = slower increment)
```

**Effect:** Directly affects how fast road and entities move.

### 2. Modify Colors

**File:** `src/constants/colors.ts`

```typescript
// Change primary color (buttons, accents)
primary: '#FF6B6B',           // Change to any hex color

// Change player car
carPlayer: '#FF6B6B',         // Red

// Change enemy car
carEnemy: '#FF1744',          // Dark red

// Change coin color
coin: '#FFD700',              // Gold

// Change background
background: '#1A1A2E',        // Dark blue
```

**Effect:** Updates all UI elements using that color.

### 3. Adjust Spawn Rates

**File:** `src/constants/gameConfig.ts`

```typescript
// Enemy spawn (milliseconds)
ENEMY_SPAWN_INTERVAL: 2000,   // Lower = more enemies

// Obstacle spawn
OBSTACLE_SPAWN_INTERVAL: 3000,

// Coin spawn
COIN_SPAWN_INTERVAL: 1500,

// Power-up spawn
POWERUP_SPAWN_INTERVAL: 5000,
```

**Effect:** Spawn rates decrease with level in `GameScreen.tsx`:
```typescript
Math.max(800, GAME_CONFIG.ENEMY_SPAWN_INTERVAL - level * 100)
```

### 4. Change Points System

**File:** `src/constants/gameConfig.ts`

```typescript
POINTS_PER_COIN: 10,              // Points for coin
POINTS_PER_SECOND: 1,             // Points per second
POINTS_PER_OBSTACLE_AVOIDED: 50,  // Points for avoiding obstacle
```

**File:** `src/screens/GameScreen.tsx`

Update score calculations:
```typescript
setScore(prev => prev + GAME_CONFIG.POINTS_PER_COIN);
```

### 5. Adjust Player Car Position

**File:** `src/constants/gameConfig.ts`

```typescript
PLAYER_INITIAL_X: (screenWidth - 50) / 2,  // Horizontal center
PLAYER_INITIAL_Y: screenHeight - 150,       // Near bottom
```

### 6. Change Road Width

**File:** `src/constants/gameConfig.ts`

```typescript
ROAD_WIDTH: screenWidth * 0.8,      // 80% of screen width
ROAD_LEFT_OFFSET: screenWidth * 0.1, // 10% from left
```

### 7. Modify Difficulty Progression

**File:** `src/screens/GameScreen.ts` - In `startGame()`:

```typescript
// Spawn intervals decrease with level
setInterval(() => {
  spawnEnemyCar();
}, Math.max(800, GAME_CONFIG.ENEMY_SPAWN_INTERVAL - level * 100))
```

Change the multiplier:
```typescript
- level * 100    // Current: decreases 100ms per level
+ level * 50     // More gradual
- level * 200    // More aggressive
```

## Adding New Features

### Add a New Power-up Type

1. **Update Type:**
   ```typescript
   // src/types/index.ts
   export type PowerUpType = 'shield' | 'speedBoost' | 'fuel' | 'slowdown';
   ```

2. **Update Component:**
   ```typescript
   // src/components/PowerUp.tsx
   const getIcon = () => {
     switch (type) {
       case 'slowdown':
         return '🐢';
       // ...
     }
   };
   ```

3. **Add Collision Logic:**
   ```typescript
   // src/screens/GameScreen.tsx
   if (checkCollision(playerBox, powerUpBox)) {
     if (powerUp.type === 'slowdown') {
       setGameSpeed(prev => Math.max(5, prev - 2));
     }
     // ...
   }
   ```

### Add Sound Effects

Install audio library:
```bash
npm install react-native-sound
```

Add sound manager:
```typescript
// src/utils/sound.ts
import Sound from 'react-native-sound';

export const playSound = (soundName: string) => {
  const sound = new Sound(`${soundName}.mp3`, Sound.MAIN_BUNDLE);
  sound.play();
};
```

Use in game:
```typescript
// src/screens/GameScreen.tsx
import { playSound } from '../utils';

// On coin collect
playSound('coin_collect');

// On collision
playSound('collision');
```

### Add Haptic Feedback

```bash
npm install react-native-haptic-feedback
```

Use in game:
```typescript
import HapticFeedback from 'react-native-haptic-feedback';

// On collision
HapticFeedback.trigger('impactMedium');

// On coin collect
HapticFeedback.trigger('selection');
```

### Add Particles/Effects

Create particle component:
```typescript
// src/components/Explosion.tsx
import LottieView from 'lottie-react-native';

export const Explosion: React.FC<{x: number; y: number}> = ({ x, y }) => {
  return (
    <LottieView
      source={require('../animations/explosion.json')}
      autoPlay
      style={{ position: 'absolute', left: x, top: y }}
    />
  );
};
```

## Performance Optimization

### Reduce Lag

1. **Decrease spawn rates** in `gameConfig.ts`:
   ```typescript
   ENEMY_SPAWN_INTERVAL: 3000,  // Instead of 2000
   ```

2. **Lower max game speed**:
   ```typescript
   MAX_GAME_SPEED: 15,  // Instead of 20
   ```

3. **Use `useMemo` for expensive calculations**:
   ```typescript
   const checkCollisions = useCallback(() => {
     // Collision logic
   }, [playerX, playerY]);
   ```

4. **Optimize re-renders**:
   ```typescript
   const PlayerCarMemo = React.memo(PlayerCar);
   ```

### Memory Usage

- Limit entities on screen (remove off-screen entities)
- Use object pooling for frequently created objects
- Clear timers on game over
- Remove listeners when screen unmounts

## Testing

### Unit Testing

```bash
npm install --save-dev @testing-library/react-native jest
```

Example test:
```typescript
// src/utils/collision.test.ts
import { checkCollision } from '../utils';

test('detects collision', () => {
  const box1 = { x: 0, y: 0, width: 50, height: 50 };
  const box2 = { x: 25, y: 25, width: 50, height: 50 };
  expect(checkCollision(box1, box2)).toBe(true);
});
```

Run tests:
```bash
npm test
```

### Manual Testing Checklist

- [ ] Game starts without errors
- [ ] Player car moves left/right
- [ ] Pause/resume works
- [ ] Enemies spawn and move
- [ ] Coins collect properly
- [ ] Collision detection accurate
- [ ] Score updates correctly
- [ ] High scores save
- [ ] Settings persist
- [ ] Game over screen shows stats

## Debugging

### Enable React DevTools

```bash
npm install --save-dev @react-navigation/devtools
```

Use in app:
```typescript
import { NavigationContainer } from '@react-navigation/native';
import { DevToolsPluginClient } from '@react-navigation/devtools';

<NavigationContainer>
  <DevToolsPluginClient />
  {/* Your app */}
</NavigationContainer>
```

### View Logs

```bash
# Android logs
adb logcat
adb logcat | grep "CarRacingGame"

# Metro bundler logs
npm start

# Both with react-native CLI
npx react-native log-android
```

### Performance Profiling

In Android Studio:
1. **View > Tool Windows > Profiler**
2. Tap on app process
3. Monitor CPU, Memory, Network

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| FPS Drop | Too many entities | Reduce spawn rates |
| High Memory | Memory leak | Check useEffect cleanup |
| Collision Bug | Offset calculation | Verify COLLISION_THRESHOLD |
| Score Freezes | Timer issue | Check setInterval cleanup |
| UI Lag | Heavy component | Use React.memo() |

## Code Style

### Naming Conventions

- **Components**: `PascalCase` (PlayerCar.tsx)
- **Functions**: `camelCase` (checkCollision)
- **Constants**: `UPPER_SNAKE_CASE` (MAX_GAME_SPEED)
- **Variables**: `camelCase` (playerX)
- **Types**: `PascalCase` (GameState)

### File Organization

```
Component files:
- Interface definitions at top
- Component function
- StyleSheet at bottom

Utility files:
- JSDoc comments for functions
- Type definitions
- Grouped by functionality

Screen files:
- Props interface
- Main component
- Sub-components
- Styles at bottom
```

### Comments

```typescript
// Use clear, concise comments
// Explain WHY, not WHAT

// Good
// Check if player moved off-road
if (playerX < ROAD_LEFT_OFFSET) {

// Bad
// If playerX less than offset
if (playerX < ROAD_LEFT_OFFSET) {
```

## Build Optimization

### Reduce App Size

```bash
# Analyze bundle
npx react-native-bundle-visualizer

# Remove unused packages
npm prune --production
```

### Build Release APK

```bash
cd android
./gradlew assembleRelease

# Find APK
# android/app/build/outputs/apk/release/app-release.apk
```

## Git Workflow

### Basic Workflow

```bash
# Create feature branch
git checkout -b feature/power-ups

# Make changes
git add src/

# Commit
git commit -m "Add shield power-up feature"

# Push
git push origin feature/power-ups

# Create PR on GitHub
```

### Useful Commands

```bash
# View changes
git diff

# Stash changes
git stash

# View commit history
git log --oneline

# Undo last commit
git reset --soft HEAD~1
```

## Resources

- **React Native Docs**: https://reactnative.dev
- **React Navigation**: https://reactnavigation.org
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Android Docs**: https://developer.android.com/docs
- **npm Packages**: https://www.npmjs.com

## Useful npm Packages

```bash
# Development
npm install --save-dev @types/react-native typescript

# UI & Navigation
npm install react-native-reanimated react-native-gesture-handler

# Storage
npm install @react-native-async-storage/async-storage

# Audio
npm install react-native-sound

# Haptics
npm install react-native-haptic-feedback

# Analytics
npm install firebase react-native-firebase
```

## Next Project Ideas

- Add online multiplayer
- Implement leaderboard
- Add different tracks
- Create shop for car skins
- Add achievements
- Implement ads
- Add daily challenges
- Cloud save/sync

---

Happy coding! 🚀

For questions or improvements, feel free to modify and experiment!
