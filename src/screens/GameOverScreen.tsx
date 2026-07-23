/**
 * Game Over Screen
 * Shows final stats and options to restart or go home
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { COLORS, GAME_CONFIG } from '../constants';
import { RootStackParamList } from '../types';
import { getTopScore, getHighScores } from '../utils';

type GameOverScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GameOver'>;
  route: RouteProp<RootStackParamList, 'GameOver'>;
};

interface HighScoreEntry {
  score: number;
  date: string;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ navigation, route }) => {
  const { score, coins, level } = route.params;
  const [topScore, setTopScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [recentScores, setRecentScores] = useState<HighScoreEntry[]>([]);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    const top = await getTopScore();
    setTopScore(top);
    setIsNewHighScore(score >= top);

    const allScores = await getHighScores();
    setRecentScores(allScores.slice(0, 5));
  };

  const handleRestart = () => {
    navigation.replace('Game');
  };

  const handleHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Game Over Header */}
        <View style={styles.headerContainer}>
          {isNewHighScore && (
            <View style={styles.newHighScoreBanner}>
              <Text style={styles.newHighScoreText}>🏆 NEW HIGH SCORE! 🏆</Text>
            </View>
          )}

          <Text style={styles.gameOverTitle}>GAME OVER</Text>
          <Text style={styles.gameOverEmoji}>💥</Text>
        </View>

        {/* Final Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>FINAL SCORE</Text>
            <Text style={styles.statValue}>{score.toString().padStart(6, '0')}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>COINS COLLECTED</Text>
            <Text style={[styles.statValue, { color: COLORS.coin }]}>{coins}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>LEVEL REACHED</Text>
            <Text style={[styles.statValue, { color: COLORS.secondary }]}>{level}</Text>
          </View>
        </View>

        {/* Comparison with Top Score */}
        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Your Score</Text>
            <Text style={styles.comparisonValue}>{score}</Text>
          </View>

          <View style={styles.comparisonDivider}>
            <Text style={styles.comparisonDividerText}>vs</Text>
          </View>

          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>High Score</Text>
            <Text style={styles.comparisonValue}>{topScore}</Text>
          </View>
        </View>

        {/* Recent Scores */}
        {recentScores.length > 0 && (
          <View style={styles.recentScoresContainer}>
            <Text style={styles.recentScoresTitle}>TOP SCORES</Text>

            {recentScores.map((entry, index) => (
              <View key={index} style={styles.scoreRow}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
                <View style={styles.scoreInfo}>
                  <Text style={styles.scoreText}>{entry.score}</Text>
                  <Text style={styles.dateText}>{entry.date}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.restartButton}
            onPress={handleRestart}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>🔄 PLAY AGAIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleHome}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>🏠 HOME</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 TIPS</Text>
          <Text style={styles.tipsText}>• Use swipe controls to move left/right</Text>
          <Text style={styles.tipsText}>• Collect coins for extra points</Text>
          <Text style={styles.tipsText}>• Shield power-ups protect you once</Text>
          <Text style={styles.tipsText}>• Game speed increases with score</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  newHighScoreBanner: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  newHighScoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.background,
    letterSpacing: 1,
  },
  gameOverTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: 10,
  },
  gameOverEmoji: {
    fontSize: 60,
  },
  statsContainer: {
    marginVertical: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 5,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  comparisonContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: 15,
    marginVertical: 20,
    alignItems: 'center',
  },
  comparisonItem: {
    flex: 1,
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  comparisonValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  comparisonDivider: {
    width: 1,
    height: 50,
    backgroundColor: COLORS.textSecondary,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comparisonDividerText: {
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  recentScoresContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 15,
    marginVertical: 20,
  },
  recentScoresTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textSecondary,
    paddingBottom: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.white10,
  },
  rankBadge: {
    backgroundColor: COLORS.accent,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  dateText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 20,
  },
  restartButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.text,
  },
  homeButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.text,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tipsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 15,
    marginVertical: 20,
    marginBottom: 40,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
    lineHeight: 18,
  },
});

export default GameOverScreen;
