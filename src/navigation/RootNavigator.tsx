/**
 * Root Navigation Stack
 * Manages all screen navigation in the app
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomeScreen,
  GameScreen,
  GameOverScreen,
  HighScoresScreen,
  SettingsScreen,
} from '../screens';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root Navigator Component
 * Defines the navigation structure
 */
export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#1A1A2E' },
          animationEnabled: true,
        }}
        initialRouteName="Home"
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="GameOver"
          component={GameOverScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="HighScores"
          component={HighScoresScreen}
          options={{
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            animationEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
