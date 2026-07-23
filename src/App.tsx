/**
 * Main App Component
 * Root component of the Car Racing Game application
 */

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import RootNavigator from './navigation/RootNavigator';

/**
 * App Component
 * - Wraps the entire app with GestureHandlerRootView
 * - Initializes navigation
 * - Sets up global styles
 */
const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <RootNavigator />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
