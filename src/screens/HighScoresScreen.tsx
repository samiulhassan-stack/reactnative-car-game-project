/**
 * High Scores Screen
 * Displays list of top scores
 */

import React, { useEffect, useState, useFocusEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect as useReactNavigationFocus } from '@react-navigation/native';
import { COLORS } from '../constants';
import { RootStackParamList, HighScoreData } from '../types';
import { getHighScores, clearHighScores } from '../utils';

type HighScoresScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'HighScores'>;
};

export const HighScoresScreen: React.FC<HighScoresScreenProps> = ({ navigation }) => {
  const [scores, setScores] = useState<HighScoreData[]>([]);
  const [loading, setLoading] = useState(true);

  // Reload scores when screen is focused
  useReactNavigationFocus(() => {
    loadScores();
  });

  const loadScores = async () => {
    try {
      setLoading(true);
      const data = await getHighScores();
      setScores(data);
    } catch (error) {
      console.error('Error loading scores:', error);
      Alert.alert('Error', 'Failed to load high scores');
    } finally {
      setLoading(false);
    }
  };

  const handleClearScores = () => {
    Alert.alert(
      'Clear High Scores',
      'Are you sure you want to delete all high scores?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            await clearHighScores();
            setScores([]);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const renderScoreItem = ({ item, index }: { item: HighScoreData; index: number }) => (
    <View style={[styles.scoreItem, index === 0 && styles.topScoreItem]}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>{getMedalEmoji(index + 1)}</Text>
      </View>

      <View style={styles.scoreDetails}>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreValue}>{item.score.toString().padStart(6, '0')}</Text>
          <Text style={styles.scoreDate}>{item.date}</Text>
        </View>
        <View style={styles.extraInfo}>
          <Text style={styles.extraText}>Level: {item.level}</Text>
          <Text style={styles.extraText}>Coins: {item.coins}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>HIGH SCORES</Text>
        <View style={styles.backButton} />
      </View>

      {/* Scores List */}
      {scores.length > 0 ? (
        <>
          <FlatList
            data={scores}
            renderItem={renderScoreItem}
            keyExtractor={(_, index) => index.toString()}
            scrollEnabled={true}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Summary Stats */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Scores</Text>
              <Text style={styles.summaryValue}>{scores.length}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avg Score</Text>
              <Text style={styles.summaryValue}>
                {Math.floor(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Best Level</Text>
              <Text style={styles.summaryValue}>
                {Math.max(...scores.map(s => s.level))}
              </Text>
            </View>
          </View>

          {/* Clear Button */}
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearScores}
          >
            <Text style={styles.clearButtonText}>🗑️ CLEAR ALL SCORES</Text>
          </TouchableOpacity>
        </>
      ) : (
        // Empty State
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyTitle}>No Scores Yet</Text>
          <Text style={styles.emptyText}>
            Play a game to see your high scores here!
          </Text>

          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              navigation.navigate('Home');
            }}
          >
            <Text style={styles.playButtonText}>🎮 PLAY GAME</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textSecondary,
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  backButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 2,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  scoreItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.textSecondary,
    alignItems: 'center',
  },
  topScoreItem: {
    backgroundColor: COLORS.surfaceLight,
    borderLeftColor: COLORS.accent,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.accent,
  },
  rankContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 28,
  },
  scoreDetails: {
    flex: 1,
    marginLeft: 15,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  scoreDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  extraInfo: {
    flexDirection: 'row',
    gap: 15,
  },
  extraText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 10,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 3,
    borderTopColor: COLORS.secondary,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 5,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  clearButton: {
    marginHorizontal: 15,
    marginBottom: 15,
    paddingVertical: 12,
    backgroundColor: COLORS.error,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.text,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  playButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.text,
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

export default HighScoresScreen;
