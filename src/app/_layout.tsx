import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Game Picker',
            headerBackground: () => (
              <LinearGradient
                colors={['#330074', '#5B21B6', '#7C3AED']}
                end={{ x: 1, y: 0 }}
                start={{ x: 0, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            ),
            headerShadowVisible: false,
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '700' },
          }}
        />
        <Stack.Screen
          name="game/[id]"
          options={{ headerShown: false, presentation: 'fullScreenModal' }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
