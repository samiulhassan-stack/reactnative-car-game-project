/**
 * Settings Screen
 * Game settings and configuration
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../constants';
import { RootStackParamList, GameSettings } from '../types';
import { getSettings, saveSettings } from '../utils';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    vibrationEnabled: true,
    difficultyLevel: 'normal',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await getSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: GameSettings) => {
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleSoundToggle = () => {
    const newSettings = { ...settings, soundEnabled: !settings.soundEnabled };
    updateSettings(newSettings);
  };

  const handleVibrationToggle = () => {
    const newSettings = { ...settings, vibrationEnabled: !settings.vibrationEnabled };
    updateSettings(newSettings);
  };

  const handleDifficultyChange = (level: 'easy' | 'normal' | 'hard') => {
    const newSettings = { ...settings, difficultyLevel: level };
    updateSettings(newSettings);
  };

  const getDifficultyDescription = (level: string) => {
    switch (level) {
      case 'easy':
        return 'Slower enemies, longer spawn intervals';
      case 'normal':
        return 'Balanced gameplay experience';
      case 'hard':
        return 'Faster enemies, more obstacles';
      default:
        return '';
    }
  };

  const getDifficultyEmoji = (level: string) => {
    switch (level) {
      case 'easy':
        return '😊';
      case 'normal':
        return '🎮';
      case 'hard':
        return '🔥';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading settings...</Text>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.title}>SETTINGS</Text>
        <View style={styles.backButton} />
      </View>

      {/* Settings Content */}
      <View style={styles.content}>
        {/* Audio Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔊 AUDIO</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Text style={styles.settingDescription}>Game sounds and effects</Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={handleSoundToggle}
              trackColor={{ false: COLORS.textMuted, true: COLORS.primary }}
              thumbColor={COLORS.text}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Vibration</Text>
              <Text style={styles.settingDescription}>Haptic feedback</Text>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={handleVibrationToggle}
              trackColor={{ false: COLORS.textMuted, true: COLORS.primary }}
              thumbColor={COLORS.text}
            />
          </View>
        </View>

        {/* Difficulty Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ DIFFICULTY</Text>
          <Text style={styles.difficultyInfo}>
            Choose your preferred challenge level:
          </Text>

          {['easy', 'normal', 'hard'].map(level => (
            <TouchableOpacity
              key={level}
              style={[
                styles.difficultyOption,
                settings.difficultyLevel === level && styles.difficultyOptionSelected,
              ]}
              onPress={() => handleDifficultyChange(level as any)}
            >
              <View style={styles.difficultyContent}>
                <Text style={styles.difficultyEmoji}>
                  {getDifficultyEmoji(level)}
                </Text>
                <View style={styles.difficultyText}>
                  <Text style={styles.difficultyLevel}>
                    {level.toUpperCase()}
                  </Text>
                  <Text style={styles.difficultyDescription}>
                    {getDifficultyDescription(level)}
                  </Text>
                </View>
              </View>
              {settings.difficultyLevel === level && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Game Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ GAME INFO</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Game Title</Text>
            <Text style={styles.infoValue}>Car Racing Game</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Platform</Text>
            <Text style={styles.infoValue}>React Native</Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 HOW TO PLAY</Text>

          <Text style={styles.tip}>• Swipe left/right or tap buttons to move</Text>
          <Text style={styles.tip}>• Collect coins for bonus points</Text>
          <Text style={styles.tip}>• Avoid enemy cars and obstacles</Text>
          <Text style={styles.tip}>• Shield power-ups protect you once</Text>
          <Text style={styles.tip}>• Speed increases as you progress</Text>
          <Text style={styles.tip}>• Tap pause to pause/resume game</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => {
              Alert.alert(
                'About',
                'Car Racing Game v1.0.0\n\nA fast-paced endless racing game built with React Native.\n\nTry to beat your high score!',
              );
            }}
          >
            <Text style={styles.actionButtonText}>ℹ️ ABOUT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => {
              Alert.alert(
                'Share',
                'Game sharing would be configured here in a real app.',
              );
            }}
          >
            <Text style={styles.actionButtonText}>📤 SHARE</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 12,
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  difficultyInfo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  difficultyOption: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  difficultyOptionSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surfaceLight,
  },
  difficultyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  difficultyEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  difficultyText: {
    flex: 1,
  },
  difficultyLevel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  difficultyDescription: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  checkmark: {
    fontSize: 18,
    color: COLORS.success,
    fontWeight: 'bold',
  },
  infoItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
  },
  tip: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  actionSection: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  infoButton: {
    flex: 1,
    backgroundColor: COLORS.info,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.text,
  },
  shareButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.text,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

export default SettingsScreen;
