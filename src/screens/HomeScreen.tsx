/**
 * Home Screen
 * Main menu with Play, High Score, and Settings options
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, GAME_CONFIG } from '../constants';
import { RootStackParamList } from '../types';
import { getTopScore } from '../utils';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [topScore, setTopScore] = useState(0);

  useEffect(() => {
    const loadTopScore = async () => {
      const score = await getTopScore();
      setTopScore(score);
    };
    loadTopScore();

    // Refresh top score whenever we navigate back to home
    const unsubscribe = navigation.addListener('focus', loadTopScore);
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Background gradient effect with colored shapes */}
      <View style={styles.backgroundShapes}>
        <View style={[styles.shape, styles.shape1]} />
        <View style={[styles.shape, styles.shape2]} />
        <View style={[styles.shape, styles.shape3]} />
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>🏎️</Text>
          <Text style={styles.mainTitle}>CAR RACING</Text>
          <Text style={styles.subtitle}>HIGH SPEED ADVENTURE</Text>
        </View>

        {/* Top Score Display */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>TOP SCORE</Text>
          <Text style={styles.scoreValue}>{topScore.toString().padStart(6, '0')}</Text>
        </View>

        {/* Play Button */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate('Game')}
          activeOpacity={0.7}
        >
          <Text style={styles.playButtonText}>PLAY GAME</Text>
        </TouchableOpacity>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statText}>Endless Road</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🚗</Text>
            <Text style={styles.statText}>Dodge Cars</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statText}>Collect Coins</Text>
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navContainer}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('HighScores')}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>HIGH SCORES</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>SETTINGS</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundShapes: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  shape: {
    position: 'absolute',
    opacity: 0.1,
  },
  shape1: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primary,
    top: -50,
    right: -50,
  },
  shape2: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.secondary,
    bottom: 100,
    left: -50,
  },
  shape3: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.accent,
    bottom: 20,
    right: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 80,
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  scoreLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  playButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 2,
    borderColor: COLORS.text,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  playButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  statText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  navContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  version: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
});

export default HomeScreen;
