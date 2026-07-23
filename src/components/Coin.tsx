/**
 * Coin Component
 * Renders collectible coins on the road
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, GAME_CONFIG } from '../constants';

interface CoinProps {
  x: number;
  y: number;
}

export const Coin: React.FC<CoinProps> = ({ x, y }) => {
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
      <View style={styles.coin}>
        <View style={styles.coinShine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONFIG.COIN_SIZE,
    height: GAME_CONFIG.COIN_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coin: {
    width: '100%',
    height: '100%',
    borderRadius: GAME_CONFIG.COIN_SIZE / 2,
    backgroundColor: COLORS.coin,
    borderWidth: 2,
    borderColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinShine: {
    width: GAME_CONFIG.COIN_SIZE * 0.4,
    height: GAME_CONFIG.COIN_SIZE * 0.4,
    borderRadius: GAME_CONFIG.COIN_SIZE * 0.2,
    backgroundColor: COLORS.white50,
    position: 'absolute',
    top: 4,
    left: 4,
  },
});

export default Coin;
