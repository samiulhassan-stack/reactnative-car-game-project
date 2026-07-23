/**
 * HUD (Heads-Up Display) Component
 * Displays score, coins, level, and speed
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, GAME_CONFIG } from '../constants';

interface HUDProps {
  score: number;
  coins: number;
  level: number;
  speed: number;
  time: number;
}

export const HUD: React.FC<HUDProps> = ({ score, coins, level, speed, time }) => {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Top row - Score and Coins */}
      <View style={styles.topRow}>
        <View style={styles.stat}>
          <Text style={styles.label}>SCORE</Text>
          <Text style={styles.value}>{score.toString().padStart(6, '0')}</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.label}>COINS</Text>
          <Text style={[styles.value, { color: COLORS.coin }]}>{coins}</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.label}>LEVEL</Text>
          <Text style={styles.value}>{level}</Text>
        </View>
      </View>

      {/* Bottom row - Speed and Time */}
      <View style={styles.bottomRow}>
        <View style={styles.stat}>
          <Text style={styles.label}>SPEED</Text>
          <Text style={[styles.value, { color: COLORS.powerUpSpeed }]}>
            {speed.toFixed(1)}
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.label}>TIME</Text>
          <Text style={styles.value}>{formatTime(time)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: GAME_CONFIG.SAFE_AREA_TOP,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    zIndex: 100,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    backgroundColor: COLORS.black70,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 70,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

export default HUD;
