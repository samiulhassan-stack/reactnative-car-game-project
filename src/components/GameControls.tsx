/**
 * Game Controls Component
 * Provides button controls for player movement (Left, Right, Pause)
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, GAME_CONFIG } from '../constants';

interface GameControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onPause: () => void;
  isPaused: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onPause,
  isPaused,
}) => {
  return (
    <View style={styles.container}>
      {/* Left Button */}
      <TouchableOpacity style={styles.button} onPress={onMoveLeft}>
        <Text style={styles.buttonText}>◀</Text>
      </TouchableOpacity>

      {/* Pause Button */}
      <TouchableOpacity style={[styles.button, styles.pauseButton]} onPress={onPause}>
        <Text style={styles.buttonText}>{isPaused ? '▶' : '⏸'}</Text>
      </TouchableOpacity>

      {/* Right Button */}
      <TouchableOpacity style={styles.button} onPress={onMoveRight}>
        <Text style={styles.buttonText}>▶</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: GAME_CONFIG.SAFE_AREA_BOTTOM + 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    zIndex: 100,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.text,
    opacity: 0.8,
  },
  pauseButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: 'bold',
  },
});

export default GameControls;
