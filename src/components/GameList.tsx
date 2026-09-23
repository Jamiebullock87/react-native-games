import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Game } from '@/features/games/types';

import { GameCard } from './GameCard';

type GameListProps = {
  games: Game[];
  hasError: boolean;
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
  onSelectGame: (game: Game) => void;
};

export function GameList({
  games,
  hasError,
  isRefreshing,
  onRefresh,
  onSelectGame,
}: GameListProps) {
  if (hasError) {
    return (
      <View style={styles.message}>
        <View
          accessible
          accessibilityLabel="Could not load games. Please check your connection and try again."
          accessibilityLiveRegion="assertive"
          accessibilityRole="alert"
          style={styles.status}>
          <Text accessibilityRole="header" style={styles.messageTitle}>
            Could not load games
          </Text>
          <Text style={styles.messageBody}>
            Please check your connection and try again.
          </Text>
        </View>
        <Pressable
          accessibilityHint="Attempts to download the game list again"
          accessibilityRole="button"
          accessibilityState={{
            busy: isRefreshing,
            disabled: isRefreshing,
          }}
          disabled={isRefreshing}
          onPress={onRefresh}
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.retryText}>
            {isRefreshing ? 'Retrying…' : 'Try again'}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      accessibilityLabel="Available games"
      contentContainerStyle={[
        styles.content,
        games.length === 0 && styles.emptyContent,
      ]}
      data={games}
      initialNumToRender={6}
      keyExtractor={(game) => game.id}
      ListEmptyComponent={
        <View accessibilityLiveRegion="polite" style={styles.message}>
          <Text accessibilityRole="header" style={styles.messageTitle}>
            No games available
          </Text>
          <Text style={styles.messageBody}>
            Pull down to check for games again.
          </Text>
        </View>
      }
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      renderItem={({ item }) => (
        <GameCard game={item} onPress={onSelectGame} />
      )}
      windowSize={5}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingHorizontal: 24,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  message: {
    alignItems: 'center',
    gap: 8,
    padding: 24,
  },
  status: {
    alignItems: 'center',
    gap: 8,
  },
  messageTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  messageBody: {
    color: '#6b7280',
    textAlign: 'center',
  },
  retryButton: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 104,
    paddingHorizontal: 16,
  },
  buttonPressed: {
    opacity: 0.72,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
