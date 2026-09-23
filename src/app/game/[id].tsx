import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { useGames } from '@/features/games/useGames';

function isAllowedGameUrl(url: string): boolean {
  try {
    const { hostname, protocol } = new URL(url);

    return (
      protocol === 'https:' &&
      (hostname === 'play.famobi.com' ||
        hostname.endsWith('.famobi.com'))
    );
  } catch {
    return false;
  }
}

export default function GameScreen() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GameScreenContent />
    </SafeAreaProvider>
  );
}

function GameScreenContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { games, hasError, isLoading } = useGames();
  const [webViewFailed, setWebViewFailed] = useState(false);
  const game = games.find((candidate) => candidate.id === id);

  if (isLoading) {
    return (
      <View
        accessibilityLabel="Loading game"
        accessibilityLiveRegion="polite"
        accessibilityRole="progressbar"
        accessibilityState={{ busy: true }}
        style={styles.placeholder}>
        <ActivityIndicator accessible={false} size="large" />
      </View>
    );
  }

  if (hasError || !game || webViewFailed) {
    const message = hasError
      ? 'We could not load the game details. Please try again later.'
      : webViewFailed
        ? 'We could not open this game. Please return to the game list and try again.'
        : 'This game is currently unavailable.';

    return (
      <SafeAreaView style={styles.placeholder}>
        <View
          accessible
          accessibilityLabel={`Game unavailable. ${message}`}
          accessibilityLiveRegion="assertive"
          accessibilityRole="alert"
          style={styles.status}>
          <Text accessibilityRole="header" style={styles.title}>
            Game unavailable
          </Text>
          <Text style={styles.body}>{message}</Text>
        </View>
        <Pressable
          accessibilityHint="Returns to the game list"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.buttonText}>Back to games</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={styles.webViewContainer}>
      <View style={styles.toolbar}>
        <Pressable
          accessibilityLabel="Close game"
          accessibilityHint="Returns to the game list"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.closeButtonText}>Go Back</Text>
        </Pressable>
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          pointerEvents="none"
          style={styles.gameTitle}>
          {game.title}
        </Text>
      </View>
      <WebView
        allowsFullscreenVideo
        contentInsetAdjustmentBehavior="never"
        onError={() => setWebViewFailed(true)}
        onHttpError={() => setWebViewFailed(true)}
        source={{ uri: game.playUrl }}
        startInLoadingState
        style={styles.webView}
        onShouldStartLoadWithRequest={(request) =>
          isAllowedGameUrl(request.url)
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 24,
  },
  status: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
  },
  body: {
    color: '#6b7280',
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 44,
    paddingHorizontal: 16,
  },
  buttonPressed: {
    opacity: 0.72,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  webViewContainer: {
    backgroundColor: '#330074',
    flex: 1,
    paddingTop: 8,
    paddingBottom: 4,
  },
  toolbar: {
    alignItems: 'center',
    borderBottomColor: '#330074',
    borderBottomWidth: 4,
    flexDirection: 'row',
    minHeight: 56,
    paddingHorizontal: 12,
  },
  gameTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    left: 0,
    paddingHorizontal: 100,
    position: 'absolute',
    right: 0,
    textAlign: 'center',
  },
  webView: {
    flex: 1,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  closeButtonText: {
    color: '#000',
    fontWeight: '600',
  },
});
