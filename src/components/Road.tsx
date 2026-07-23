/**
 * Road Component
 * Renders the endless scrolling road with lane markers
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, GAME_CONFIG } from '../constants';

interface RoadProps {
  scrollOffset: number;
}

export const Road: React.FC<RoadProps> = ({ scrollOffset }) => {
  // Create multiple road lines for seamless scrolling
  const roadLines = Array.from({ length: Math.ceil(GAME_CONFIG.SCREEN_HEIGHT / GAME_CONFIG.ROAD_LINE_SPACING) + 2 }).map((_, index) => {
    const yPosition = (index * GAME_CONFIG.ROAD_LINE_SPACING - scrollOffset % GAME_CONFIG.ROAD_LINE_SPACING);
    return (
      <View
        key={index}
        style={[
          styles.roadLine,
          {
            top: yPosition,
          },
        ]}
      />
    );
  });

  return (
    <View style={styles.roadContainer}>
      {/* Road background */}
      <View style={styles.road}>
        {/* Left lane marker */}
        <View style={styles.laneBorder} />

        {/* Center lane marker */}
        <View style={styles.centerLane}>{roadLines}</View>

        {/* Right lane marker */}
        <View style={styles.laneBorder} />
      </View>

      {/* Side grass/off-road */}
      <View style={styles.offRoadLeft} />
      <View style={styles.offRoadRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  roadContainer: {
    position: 'absolute',
    width: GAME_CONFIG.SCREEN_WIDTH,
    height: GAME_CONFIG.SCREEN_HEIGHT,
    flexDirection: 'row',
    top: 0,
    left: 0,
  },
  road: {
    position: 'absolute',
    left: GAME_CONFIG.ROAD_LEFT_OFFSET,
    width: GAME_CONFIG.ROAD_WIDTH,
    height: GAME_CONFIG.SCREEN_HEIGHT,
    backgroundColor: COLORS.roadGray,
    flexDirection: 'row',
  },
  laneBorder: {
    width: 4,
    height: '100%',
    backgroundColor: COLORS.roadLineYellow,
  },
  centerLane: {
    flex: 1,
    position: 'relative',
    backgroundColor: COLORS.roadGray,
  },
  roadLine: {
    position: 'absolute',
    width: '100%',
    height: GAME_CONFIG.ROAD_LINE_HEIGHT,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.roadLineYellow,
  },
  offRoadLeft: {
    position: 'absolute',
    left: 0,
    width: GAME_CONFIG.ROAD_LEFT_OFFSET,
    height: GAME_CONFIG.SCREEN_HEIGHT,
    backgroundColor: COLORS.surface,
  },
  offRoadRight: {
    position: 'absolute',
    right: 0,
    width: GAME_CONFIG.ROAD_LEFT_OFFSET,
    height: GAME_CONFIG.SCREEN_HEIGHT,
    backgroundColor: COLORS.surface,
  },
});

export default Road;
