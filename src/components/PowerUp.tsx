/**
 * PowerUp Component
 * Renders power-up items (Shield, Speed Boost, Fuel)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, GAME_CONFIG } from '../constants';

type PowerUpType = 'shield' | 'speedBoost' | 'fuel';

interface PowerUpProps {
  x: number;
  y: number;
  type: PowerUpType;
}

export const PowerUp: React.FC<PowerUpProps> = ({ x, y, type }) => {
  const getColor = () => {
    switch (type) {
      case 'shield':
        return COLORS.powerUpShield;
      case 'speedBoost':
        return COLORS.powerUpSpeed;
      case 'fuel':
        return COLORS.powerUpFuel;
      default:
        return COLORS.accent;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'shield':
        return 'S';
      case 'speedBoost':
        return '⚡';
      case 'fuel':
        return 'F';
      default:
        return '?';
    }
  };

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
      <View style={[styles.powerUp, { backgroundColor: getColor() }]}>
        <View style={styles.shine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONFIG.POWERUP_SIZE,
    height: GAME_CONFIG.POWERUP_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerUp: {
    width: '100%',
    height: '100%',
    borderRadius: GAME_CONFIG.POWERUP_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.text,
  },
  shine: {
    position: 'absolute',
    width: GAME_CONFIG.POWERUP_SIZE * 0.3,
    height: GAME_CONFIG.POWERUP_SIZE * 0.3,
    borderRadius: GAME_CONFIG.POWERUP_SIZE * 0.15,
    backgroundColor: COLORS.white50,
    top: GAME_CONFIG.POWERUP_SIZE * 0.1,
    left: GAME_CONFIG.POWERUP_SIZE * 0.1,
  },
});

export default PowerUp;
