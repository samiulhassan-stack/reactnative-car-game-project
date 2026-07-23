/**
 * Player Car Component
 * Renders the player's car with shield indicator
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, GAME_CONFIG } from '../constants';

interface PlayerCarProps {
  x: number;
  y: number;
  hasShield: boolean;
}

export const PlayerCar: React.FC<PlayerCarProps> = ({ x, y, hasShield }) => {
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
      {/* Shield effect */}
      {hasShield && <View style={styles.shield} />}

      {/* Car body */}
      <View style={styles.car}>
        {/* Windshield */}
        <View style={styles.windshield} />
        {/* Car windows */}
        <View style={styles.window1} />
        <View style={styles.window2} />
        {/* Car bottom */}
        <View style={styles.bottom} />
      </View>

      {/* Headlights */}
      <View style={[styles.headlight, styles.headlightLeft]} />
      <View style={[styles.headlight, styles.headlightRight]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONFIG.PLAYER_CAR_WIDTH,
    height: GAME_CONFIG.PLAYER_CAR_HEIGHT,
  },
  shield: {
    position: 'absolute',
    width: GAME_CONFIG.PLAYER_CAR_WIDTH + 10,
    height: GAME_CONFIG.PLAYER_CAR_HEIGHT + 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.powerUpShield,
    top: -5,
    left: -5,
  },
  car: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.carPlayer,
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
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: COLORS.surfaceLight,
    opacity: 0.7,
  },
  headlight: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 4,
    bottom: 3,
  },
  headlightLeft: {
    left: 8,
  },
  headlightRight: {
    right: 8,
  },
});

export default PlayerCar;
