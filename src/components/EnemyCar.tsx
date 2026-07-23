/**
 * Enemy Car Component
 * Renders enemy cars on the road
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, GAME_CONFIG } from '../constants';

interface EnemyCarProps {
  x: number;
  y: number;
  color?: string;
}

export const EnemyCar: React.FC<EnemyCarProps> = ({
  x,
  y,
  color = COLORS.carEnemy,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          left: x,
          top: y,
          backgroundColor: color,
        },
      ]}
    >
      {/* Windshield */}
      <View style={styles.windshield} />
      {/* Windows */}
      <View style={styles.window1} />
      <View style={styles.window2} />
      {/* Taillights */}
      <View style={[styles.taillight, styles.taillightLeft]} />
      <View style={[styles.taillight, styles.taillightRight]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONFIG.ENEMY_CAR_WIDTH,
    height: GAME_CONFIG.ENEMY_CAR_HEIGHT,
    borderRadius: 4,
    overflow: 'hidden',
  },
  windshield: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: 5,
    height: 15,
    backgroundColor: COLORS.white50,
    borderRadius: 2,
  },
  window1: {
    position: 'absolute',
    top: 22,
    left: 8,
    width: 12,
    height: 12,
    backgroundColor: COLORS.white10,
    borderRadius: 2,
  },
  window2: {
    position: 'absolute',
    top: 22,
    right: 8,
    width: 12,
    height: 12,
    backgroundColor: COLORS.white10,
    borderRadius: 2,
  },
  taillight: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: COLORS.warning,
    borderRadius: 4,
    bottom: 3,
  },
  taillightLeft: {
    left: 8,
  },
  taillightRight: {
    right: 8,
  },
});

export default EnemyCar;
