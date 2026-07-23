# 🎮 TURBO RACER ELITE - React Native Car Racing Game

**Created by Sami Ul Hassan**

A professional HTML5 Canvas car racing game built with pure JavaScript. Experience high-speed racing with realistic car graphics, particle effects, and multiple game modes!

## 🚗 Game Features

- **Realistic Car Graphics**: Detailed 3D-style car models with headlights, spoilers, and wheels
- **Multiple Game Modes**: Arcade, Survival, and Time Attack modes
- **Day/Night Cycle**: Dynamic sky with sun/moon transitions and stars
- **Particle Effects**: Explosions, smoke trails, and nitro flames
- **Power-ups**: Shield protection and nitro boost systems
- **Professional HUD**: Lives, score, speed, and nitro indicators
- **Sound Effects**: Engine sounds, crashes, and coin collection
- **Smooth Controls**: Responsive lane changing and nitro activation
- **Coin Collection**: Collect rotating coins for bonus points
- **Enemy AI**: Smart enemy cars with brake lights and varied behavior

## 🎯 How to Play

### Controls
- **Arrow Left/Right**: Change lanes
- **Spacebar**: Activate nitro boost
- **P**: Pause/Unpause game
- **Mouse**: Navigate menus

### Objective
- Avoid crashing into enemy cars
- Collect coins for bonus points
- Use nitro strategically for speed boosts
- Pick up power-ups for advantages
- Survive as long as possible to set high scores

## 🚀 How to Run the Game

### Method 1: Local Server (Recommended)

1. **Prerequisites**: Make sure you have [Node.js](https://nodejs.org/) installed

2. **Clone the repository**:
   ```bash
   git clone https://github.com/samiulhassan-stack/reactnative-car-game-project.git
   cd reactnative-car-game-project
   ```

3. **Start the server**:
   ```bash
   node server.js
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

5. **Start playing!** The game will load automatically in your browser.

### Method 2: Direct File Opening

1. **Download** all game files
2. **Open** `index.html` directly in your web browser
3. **Note**: Some features might not work due to browser security restrictions

### Method 3: Live Server (VS Code)

1. **Install** the "Live Server" extension in VS Code
2. **Right-click** on `index.html`
3. **Select** "Open with Live Server"

## 📁 Project Structure

```
CarRacingGame/
├── index.html          # Main HTML file
├── game.js             # Complete game logic (1600+ lines)
├── server.js           # Node.js HTTP server
├── README.md           # This file
└── android/            # React Native Android files (optional)
```

## 🎮 Game Modes

### Arcade Mode
- Standard racing experience
- Balanced difficulty progression
- Perfect for casual play

### Survival Mode  
- Increasing difficulty over time
- Faster enemy spawns
- Challenge your endurance

### Time Attack Mode
- Race against the clock
- Score multipliers for speed
- Perfect your racing skills

## 🏆 Scoring System

- **Distance**: Points for distance traveled
- **Coins**: Bonus points for coin collection
- **Speed**: Multiplier bonuses for high speeds
- **Survival**: Extra points for avoiding crashes
- **Combos**: Chain actions for score multipliers

## 🔧 Technical Details

- **Engine**: Pure HTML5 Canvas with JavaScript
- **No Dependencies**: Runs entirely in the browser
- **Audio**: Web Audio API for realistic sound effects
- **Graphics**: Custom 2.5D car rendering with gradients and shadows
- **Performance**: Optimized 60fps gameplay
- **Storage**: LocalStorage for high scores

## 🎨 Graphics Features

- **Realistic Cars**: Detailed car models with body, roof, windshields
- **Dynamic Lighting**: Headlights, brake lights, and day/night effects  
- **Particle Systems**: Explosions, smoke, and flame effects
- **Animated Elements**: Rotating coins, pulsing power-ups
- **Screen Effects**: Camera shake, invincibility flashing

## 🔊 Audio Features

- **Engine Sounds**: Dynamic engine noise based on speed
- **Crash Effects**: Multi-layered crash sound effects
- **Coin Collection**: Satisfying pickup sound effects
- **Nitro Activation**: Turbo boost sound effects

## 🌟 Advanced Features

- **Screen Shake**: Immersive crash effects
- **Particle Physics**: Realistic explosion particles
- **Smooth Interpolation**: Fluid lane transitions
- **Visual Feedback**: Floating score text and effects
- **Invincibility Frames**: Temporary protection after crashes
- **Progressive Difficulty**: Adaptive enemy spawning

## 🛠️ Development

Built with modern JavaScript ES6+ features:
- Canvas 2D rendering
- Web Audio API
- LocalStorage API
- RequestAnimationFrame
- Object-oriented game architecture

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+  
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Feel free to contribute by:
- Adding new car models
- Creating additional power-ups
- Implementing new game modes
- Improving graphics and animations
- Optimizing performance

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy the race! 🏁**

*Built with ❤️ by Sami Ul Hassan using HTML5 Canvas and JavaScript*