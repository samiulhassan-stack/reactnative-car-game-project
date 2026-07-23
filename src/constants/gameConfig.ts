/**
 * Game configuration constants
 * All game parameters and settings in one place for easy tuning
 */

import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const GAME_CONFIG = {
  // Screen dimensions
  SCREEN_WIDTH: screenWidth,
  SCREEN_HEIGHT: screenHeight,

  // Road configuration
  ROAD_WIDTH: screenWidth * 0.8,
  ROAD_LEFT_OFFSET: screenWidth * 0.1,
  ROAD_LINE_HEIGHT: 40,
  ROAD_LINE_SPACING: 20,

  // Player car
  PLAYER_CAR_WIDTH: 50,
  PLAYER_CAR_HEIGHT: 80,
  PLAYER_INITIAL_X: (screenWidth - 50) / 2,
  PLAYER_INITIAL_Y: screenHeight - 150,

  // Enemy cars
  ENEMY_CAR_WIDTH: 50,
  ENEMY_CAR_HEIGHT: 80,
  ENEMY_SPAWN_INTERVAL: 2000, // milliseconds
  ENEMY_INITIAL_SPEED: 5,

  // Obstacles
  OBSTACLE_WIDTH: 60,
  OBSTACLE_HEIGHT: 60,
  OBSTACLE_SPAWN_INTERVAL: 3000,

  // Coins
  COIN_SIZE: 30,
  COIN_SPAWN_INTERVAL: 1500,

  // Power-ups
  POWERUP_SIZE: 40,
  POWERUP_SPAWN_INTERVAL: 5000,

  // Game mechanics
  INITIAL_GAME_SPEED: 8,
  MAX_GAME_SPEED: 20,
  SPEED_INCREMENT: 0.001,
  SPEED_DIFFICULTY_MULTIPLIER: 1.1,

  // Collision detection
  COLLISION_THRESHOLD: 30, // pixels

  // Movement
  SWIPE_THRESHOLD: 50, // minimum swipe distance
  BUTTON_MOVE_DISTANCE: 40, // pixels per button press

  // Animation
  ANIMATION_DURATION: 300, // milliseconds
  FRAME_RATE: 60,

  // UI
  SAFE_AREA_BOTTOM: 50,
  SAFE_AREA_TOP: 20,

  // Score
  POINTS_PER_COIN: 10,
  POINTS_PER_SECOND: 1,
  POINTS_PER_OBSTACLE_AVOIDED: 50,

  // Timer intervals (milliseconds)
  GAME_UPDATE_INTERVAL: 30,
  SCORE_UPDATE_INTERVAL: 1000,
};

export default GAME_CONFIG;
