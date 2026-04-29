/**
 * App.tsx
 *
 * Entry point của ứng dụng ZIM Academy.
 * Chịu trách nhiệm setup providers (SafeAreaProvider, StatusBar)
 * và render màn hình mặc định (HomeScreen).
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from '@/screens/Home/HomeScreen';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <HomeScreen />
    </SafeAreaProvider>
  );
}

export default App;
