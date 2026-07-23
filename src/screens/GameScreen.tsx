/**
 * Game Screen
 * Main game loop with player input, collision detection, and game mechanics
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  GestureResponderEvent,
  AppState,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, GAME_CONFIG } from '../constants';
import { RootStackParamList } from '../types';
import {
  PlayerCar,
  EnemyCar,
  Obstacle,
  Coin,
  PowerUp,
  Road,
  HUD,
  GameControls,
} from '../components';
import {
  checkCollision,
  isOutOfBounds,
  randomRoadPosition,
  randomInt,
  randomItem,
} from '../utils';
import { saveHighScore, getTopScore } from '../utils';

type GameScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
};

interface GameEntity {
  id: string;
  x: number;
  y: number;
}

export const GameScreen: React.FC<GameScreenProps> = ({ navigation }) => {
  // Game state
  const [playerX, setPlayerX] = useState(GAME_CONFIG.PLAYER_INITIAL_X);
  const [playerY] = useState(GAME_CONFIG.PLAYER_INITIAL_Y);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameSpeed, setGameSpeed] = useState(GAME_CONFIG.INITIAL_GAME_SPEED);
  const [gameTime, setGameTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasShield, setHasShield] = useState(false);

  // Game entities
  const [enemyCars, setEnemyCars] = useState<GameEntity[]>([]);
  const [obstacles, setObstacles] = useState<GameEntity[]>([]);
  const [coinList, setCoinList] = useState<GameEntity[]>([]);
  const [powerUps, setPowerUps] = useState<GameEntity[]>([]);

  // Refs for timing
  const gameLoopRef = useRef<NodeJS.Timer | null>(null);
  const scoreTimerRef = useRef<NodeJS.Timer | null>(null);
  const spawnTimersRef = useRef<NodeJS.Timer[]>([]);
  const roadScrollRef = useRef(0);
  const appStateRef = useRef(AppState.currentState);

  /**
   * Initialize game
   */
  useEffect(() => {
    startGame();
    return () => stopGame();
  }, []);

  /**
   * Listen for app state changes (pause/resume)
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  /**
   * Handle app state changes
   */
  const handleAppStateChange = (state: string) => {
    if (state === 'background' && !isPaused && !isGameOver) {
      setIsPaused(true);
    }
    appStateRef.current = state;
  };

  /**
   * Start the game
   */
  const startGame = () => {
    // Main game loop - updates every 30ms
    gameLoopRef.current = setInterval(() => {
      if (!isPaused && !isGameOver) {
        updateGame();
      }
    }, GAME_CONFIG.GAME_UPDATE_INTERVAL);

    // Score timer - updates every 1 second
    scoreTimerRef.current = setInterval(() => {
      if (!isPaused && !isGameOver) {
        setGameTime(prev => prev + 1000);
        setScore(prev => prev + GAME_CONFIG.POINTS_PER_SECOND);
      }
    }, GAME_CONFIG.SCORE_UPDATE_INTERVAL);

    // Spawn timers for different entities
    spawnTimersRef.current = [
      setInterval(() => {
        if (!isPaused && !isGameOver) {
          spawnEnemyCar();
        }
      }, Math.max(800, GAME_CONFIG.ENEMY_SPAWN_INTERVAL - level * 100)),

      setInterval(() => {
        if (!isPaused && !isGameOver) {
          spawnObstacle();
        }
      }, Math.max(1500, GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL - level * 150)),

      setInterval(() => {
        if (!isPaused && !isGameOver) {
          spawnCoin();
        }
      }, Math.max(1000, GAME_CONFIG.COIN_SPAWN_INTERVAL - level * 100)),

      setInterval(() => {
        if (!isPaused && !isGameOver && level >= 2) {
          spawnPowerUp();
        }
      }, GAME_CONFIG.POWERUP_SPAWN_INTERVAL),
    ];
  };

  /**
   * Stop the game
   */
  const stopGame = () => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (scoreTimerRef.current) clearInterval(scoreTimerRef.current);
    spawnTimersRef.current.forEach(timer => clearInterval(timer));
  };

  /**
   * Update game state
   */
  const updateGame = () => {
    roadScrollRef.current += gameSpeed;

    // Update game speed based on score
    const newLevel = Math.floor(score / 1000) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
    }

    // Increase game speed gradually
    setGameSpeed(prev =>
      Math.min(
        prev + GAME_CONFIG.SPEED_INCREMENT,
        GAME_CONFIG.MAX_GAME_SPEED
      )
    );

    // Update enemies
    updateEnemyCars();

    // Update obstacles
    updateObstacles();

    // Update coins
    updateCoins();

    // Update power-ups
    updatePowerUps();

    // Check collisions
    checkCollisions();
  };

  /**
   * Spawn an enemy car
   */
  const spawnEnemyCar = () => {
    const newCar = randomRoadPosition(
      GAME_CONFIG.ROAD_WIDTH - GAME_CONFIG.ENEMY_CAR_WIDTH,
      GAME_CONFIG.ROAD_LEFT_OFFSET,
      -GAME_CONFIG.ENEMY_CAR_HEIGHT,
      GAME_CONFIG.ENEMY_CAR_WIDTH
    );

    setEnemyCars(prev => [...prev, {
      id: `enemy_${Date.now()}`,
      x: newCar.x,
      y: newCar.y,
    }]);
  };

  /**
   * Update enemy car positions
   */
  const updateEnemyCars = () => {
    setEnemyCars(prev => {
      return prev
        .map(car => ({ ...car, y: car.y + gameSpeed }))
        .filter(car => !isOutOfBounds(car));
    });
  };

  /**
   * Spawn an obstacle
   */
  const spawnObstacle = () => {
    const newObstacle = randomRoadPosition(
      GAME_CONFIG.ROAD_WIDTH - GAME_CONFIG.OBSTACLE_WIDTH,
      GAME_CONFIG.ROAD_LEFT_OFFSET,
      -GAME_CONFIG.OBSTACLE_HEIGHT,
      GAME_CONFIG.OBSTACLE_WIDTH
    );

    setObstacles(prev => [...prev, {
      id: `obstacle_${Date.now()}`,
      x: newObstacle.x,
      y: newObstacle.y,
    }]);
  };

  /**
   * Update obstacle positions
   */
  const updateObstacles = () => {
    setObstacles(prev => {
      return prev
        .map(obstacle => ({ ...obstacle, y: obstacle.y + gameSpeed }))
        .filter(obstacle => !isOutOfBounds(obstacle));
    });
  };

  /**
   * Spawn a coin
   */
  const spawnCoin = () => {
    const newCoin = randomRoadPosition(
      GAME_CONFIG.ROAD_WIDTH - GAME_CONFIG.COIN_SIZE,
      GAME_CONFIG.ROAD_LEFT_OFFSET,
      -GAME_CONFIG.COIN_SIZE,
      GAME_CONFIG.COIN_SIZE
    );

    setCoinList(prev => [...prev, {
      id: `coin_${Date.now()}`,
      x: newCoin.x,
      y: newCoin.y,
    }]);
  };

  /**
   * Update coin positions
   */
  const updateCoins = () => {
    setCoinList(prev => {
      return prev
        .map(coin => ({ ...coin, y: coin.y + gameSpeed }))
        .filter(coin => !isOutOfBounds(coin));
    });
  };

  /**
   * Spawn a power-up
   */
  const spawnPowerUp = () => {
    const newPowerUp = randomRoadPosition(
      GAME_CONFIG.ROAD_WIDTH - GAME_CONFIG.POWERUP_SIZE,
      GAME_CONFIG.ROAD_LEFT_OFFSET,
      -GAME_CONFIG.POWERUP_SIZE,
      GAME_CONFIG.POWERUP_SIZE
    );

    setPowerUps(prev => [...prev, {
      id: `powerup_${Date.now()}`,
      x: newPowerUp.x,
      y: newPowerUp.y,
    }]);
  };

  /**
   * Update power-up positions
   */
  const updatePowerUps = () => {
    setPowerUps(prev => {
      return prev
        .map(powerUp => ({ ...powerUp, y: powerUp.y + gameSpeed }))
        .filter(powerUp => !isOutOfBounds(powerUp));
    });
  };

  /**
   * Check all collisions
   */
  const checkCollisions = () => {
    const playerBox = {
      x: playerX,
      y: playerY,
      width: GAME_CONFIG.PLAYER_CAR_WIDTH,
      height: GAME_CONFIG.PLAYER_CAR_HEIGHT,
    };

    // Check collision with enemy cars
    for (const enemy of enemyCars) {
      const enemyBox = {
        x: enemy.x,
        y: enemy.y,
        width: GAME_CONFIG.ENEMY_CAR_WIDTH,
        height: GAME_CONFIG.ENEMY_CAR_HEIGHT,
      };

      if (checkCollision(playerBox, enemyBox)) {
        if (hasShield) {
          setHasShield(false);
          setEnemyCars(prev => prev.filter(e => e.id !== enemy.id));
        } else {
          endGame();
        }
        return;
      }
    }

    // Check collision with obstacles
    for (const obstacle of obstacles) {
      const obstacleBox = {
        x: obstacle.x,
        y: obstacle.y,
        width: GAME_CONFIG.OBSTACLE_WIDTH,
        height: GAME_CONFIG.OBSTACLE_HEIGHT,
      };

      if (checkCollision(playerBox, obstacleBox)) {
        if (hasShield) {
          setHasShield(false);
          setObstacles(prev => prev.filter(o => o.id !== obstacle.id));
        } else {
          endGame();
        }
        return;
      }
    }

    // Check collision with coins
    coinList.forEach(coin => {
      const coinBox = {
        x: coin.x,
        y: coin.y,
        width: GAME_CONFIG.COIN_SIZE,
        height: GAME_CONFIG.COIN_SIZE,
      };

      if (checkCollision(playerBox, coinBox)) {
        setCoins(prev => prev + 1);
        setScore(prev => prev + GAME_CONFIG.POINTS_PER_COIN);
        setCoinList(prev => prev.filter(c => c.id !== coin.id));
      }
    });

    // Check collision with power-ups
    powerUps.forEach(powerUp => {
      const powerUpBox = {
        x: powerUp.x,
        y: powerUp.y,
        width: GAME_CONFIG.POWERUP_SIZE,
        height: GAME_CONFIG.POWERUP_SIZE,
      };

      if (checkCollision(playerBox, powerUpBox)) {
        // Apply shield power-up
        setHasShield(true);
        setPowerUps(prev => prev.filter(p => p.id !== powerUp.id));
      }
    });
  };

  /**
   * End the game
   */
  const endGame = () => {
    setIsGameOver(true);
    stopGame();

    // Save high score
    saveHighScore({
      score,
      coins,
      level,
      date: new Date().toLocaleDateString(),
    });

    // Navigate to game over screen after a delay
    setTimeout(() => {
      navigation.replace('GameOver', {
        score,
        coins,
        level,
      });
    }, 500);
  };

  /**
   * Handle pause/resume
   */
  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  /**
   * Handle player movement
   */
  const handleMoveLeft = () => {
    setPlayerX(prev =>
      Math.max(prev - GAME_CONFIG.BUTTON_MOVE_DISTANCE, GAME_CONFIG.ROAD_LEFT_OFFSET)
    );
  };

  const handleMoveRight = () => {
    setPlayerX(prev =>
      Math.min(
        prev + GAME_CONFIG.BUTTON_MOVE_DISTANCE,
        GAME_CONFIG.ROAD_LEFT_OFFSET + GAME_CONFIG.ROAD_WIDTH - GAME_CONFIG.PLAYER_CAR_WIDTH
      )
    );
  };

  /**
   * Handle touch events for swipe controls
   */
  let startX = 0;
  const handleTouchStart = (event: GestureResponderEvent) => {
    startX = event.nativeEvent.locationX;
  };

  const handleTouchEnd = (event: GestureResponderEvent) => {
    const endX = event.nativeEvent.locationX;
    const swipeDistance = endX - startX;

    if (Math.abs(swipeDistance) > GAME_CONFIG.SWIPE_THRESHOLD) {
      if (swipeDistance < 0) {
        handleMoveLeft();
      } else {
        handleMoveRight();
      }
    }
  };

  return (
    <View
      style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Road background */}
      <Road scrollOffset={roadScrollRef.current} />

      {/* Game entities */}
      {enemyCars.map(car => (
        <EnemyCar key={car.id} x={car.x} y={car.y} />
      ))}

      {obstacles.map(obstacle => (
        <Obstacle key={obstacle.id} x={obstacle.x} y={obstacle.y} type="cone" />
      ))}

      {coinList.map(coin => (
        <Coin key={coin.id} x={coin.x} y={coin.y} />
      ))}

      {powerUps.map(powerUp => (
        <PowerUp key={powerUp.id} x={powerUp.x} y={powerUp.y} type="shield" />
      ))}

      {/* Player car */}
      <PlayerCar x={playerX} y={playerY} hasShield={hasShield} />

      {/* HUD */}
      <HUD
        score={score}
        coins={coins}
        level={level}
        speed={gameSpeed}
        time={gameTime}
      />

      {/* Game controls */}
      <GameControls
        onMoveLeft={handleMoveLeft}
        onMoveRight={handleMoveRight}
        onPause={handlePause}
        isPaused={isPaused}
      />

      {/* Pause overlay */}
      <Modal
        visible={isPaused}
        transparent
        animationType="fade"
      >
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseContent}>
            <Text style={styles.pauseTitle}>PAUSED</Text>
            <Text style={styles.pauseScore}>Score: {score}</Text>

            <TouchableOpacity
              style={styles.pauseButton}
              onPress={handlePause}
            >
              <Text style={styles.pauseButtonText}>RESUME</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pauseButton, styles.quitButton]}
              onPress={() => {
                stopGame();
                navigation.goBack();
              }}
            >
              <Text style={styles.pauseButtonText}>QUIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  pauseOverlay: {
    flex: 1,
    backgroundColor: COLORS.black70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  pauseTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: 10,
  },
  pauseScore: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 30,
  },
  pauseButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  quitButton: {
    backgroundColor: COLORS.error,
  },
  pauseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

export default GameScreen;
