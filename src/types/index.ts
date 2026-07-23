/**
 * TypeScript type definitions for the Car Racing Game
 */

// Game entity position and size
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Entity extends Position, Size {
  id: string;
}

// Player car state
export interface PlayerCar extends Position, Size {
  speed: number;
  shield: boolean;
  shieldDuration: number;
}

// Enemy car
export interface EnemyCar extends Entity {
  speed: number;
  createdAt: number;
}

// Obstacle
export interface Obstacle extends Entity {
  type: 'cone' | 'rock' | 'puddle';
  createdAt: number;
}

// Coin
export interface Coin extends Entity {
  value: number;
  createdAt: number;
}

// Power-up types
export type PowerUpType = 'shield' | 'speedBoost' | 'fuel';

export interface PowerUp extends Entity {
  type: PowerUpType;
  duration: number;
  createdAt: number;
}

// Game state
export interface GameState {
  score: number;
  coins: number;
  level: number;
  speed: number;
  isPaused: boolean;
  isGameOver: boolean;
  gameTime: number;
  activePowerUps: PowerUp[];
}

// High score data
export interface HighScoreData {
  score: number;
  coins: number;
  level: number;
  date: string;
}

// Settings
export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  difficultyLevel: 'easy' | 'normal' | 'hard';
}

// Navigation params
export type RootStackParamList = {
  Home: undefined;
  Game: undefined;
  GameOver: {
    score: number;
    coins: number;
    level: number;
  };
  HighScores: undefined;
  Settings: undefined;
};
