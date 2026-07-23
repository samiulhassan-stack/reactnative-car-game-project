/**
 * Obstacle Component
 * Renders obstacles on the road (cones, rocks, puddles)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, GAME_CONFIG } from '../constants';

type ObstacleType = 'cone' | 'rock' | 'puddle';

interface ObstacleProps {
  x: number;
  y: number;
  type: ObstacleType;
}

export const Obstacle: React.FC<ObstacleProps> = ({ x, y, type }) => {
  return (
    <View
      style={[
        styles.container,
        {
          left: x,
          top: y,
        },
      ]}
    >
      {type === 'cone' && <View style={styles.cone} />}
      {type === 'rock' && <View style={styles.rock} />}
      {type === 'puddle' && <View style={styles.puddle} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONFIG.OBSTACLE_WIDTH,
    height: GAME_CONFIG.OBSTACLE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cone: {
    width: GAME_CONFIG.OBSTACLE_WIDTH * 0.6,
    height: GAME_CONFIG.OBSTACLE_HEIGHT * 0.8,
    backgroundColor: COLORS.carObstacle,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: GAME_CONFIG.OBSTACLE_WIDTH * 0.3,
    borderBottomRightRadius: GAME_CONFIG.OBSTACLE_WIDTH * 0.3,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
  },
  rock: {
    width: GAME_CONFIG.OBSTACLE_WIDTH * 0.7,
    height: GAME_CONFIG.OBSTACLE_HEIGHT * 0.7,
    backgroundColor: COLORS.textSecondary,
    borderRadius: GAME_CONFIG.OBSTACLE_WIDTH * 0.35,
  },
  puddle: {
    width: GAME_CONFIG.OBSTACLE_WIDTH * 0.9,
    height: GAME_CONFIG.OBSTACLE_HEIGHT * 0.5,
    backgroundColor: COLORS.info,
    borderRadius: GAME_CONFIG.OBSTACLE_WIDTH * 0.45,
    opacity: 0.6,
  },
});

export default Obstacle;
