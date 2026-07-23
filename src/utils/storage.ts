/**
 * AsyncStorage utility functions for persistent data
 * Handles high scores, settings, and game progress
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { HighScoreData, GameSettings } from '../types';

const STORAGE_KEYS = {
  HIGH_SCORES: 'high_scores',
  SETTINGS: 'game_settings',
  LAST_PLAYED: 'last_played',
};

/**
 * Get all high scores from storage
 */
export async function getHighScores(): Promise<HighScoreData[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting high scores:', error);
    return [];
  }
}

/**
 * Save a new high score
 */
export async function saveHighScore(score: HighScoreData): Promise<void> {
  try {
    const scores = await getHighScores();
    scores.push(score);
    // Sort by score descending and keep top 10
    scores.sort((a, b) => b.score - a.score);
    const topScores = scores.slice(0, 10);
    await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(topScores));
  } catch (error) {
    console.error('Error saving high score:', error);
  }
}

/**
 * Get the top high score
 */
export async function getTopScore(): Promise<number> {
  try {
    const scores = await getHighScores();
    return scores.length > 0 ? scores[0].score : 0;
  } catch (error) {
    console.error('Error getting top score:', error);
    return 0;
  }
}

/**
 * Clear all high scores
 */
export async function clearHighScores(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.HIGH_SCORES);
  } catch (error) {
    console.error('Error clearing high scores:', error);
  }
}

/**
 * Get game settings
 */
export async function getSettings(): Promise<GameSettings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : getDefaultSettings();
  } catch (error) {
    console.error('Error getting settings:', error);
    return getDefaultSettings();
  }
}

/**
 * Save game settings
 */
export async function saveSettings(settings: GameSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

/**
 * Get default settings
 */
export function getDefaultSettings(): GameSettings {
  return {
    soundEnabled: true,
    vibrationEnabled: true,
    difficultyLevel: 'normal',
  };
}

/**
 * Save last played game info
 */
export async function saveLastPlayed(score: number, level: number): Promise<void> {
  try {
    const data = {
      score,
      level,
      timestamp: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_PLAYED, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving last played:', error);
  }
}

/**
 * Get last played game info
 */
export async function getLastPlayed(): Promise<any> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_PLAYED);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting last played:', error);
    return null;
  }
}
