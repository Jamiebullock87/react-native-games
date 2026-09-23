import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GameList } from '@/components/GameList';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { useGames } from '@/features/games/useGames';

export default function HomeScreen() {
  const { games, hasError, isLoading, isRefreshing, refresh } = useGames();

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Pick a game
        </Text>
        <Text style={styles.subtitle}>Free games from HTML5Games</Text>
      </View>

      <View style={styles.content}>
        <GameList
          games={games}
          hasError={hasError}
          isRefreshing={isRefreshing}
          onRefresh={refresh}
          onSelectGame={(game) =>
            router.push({ pathname: '/game/[id]', params: { id: game.id } })
          }
        />
        <LoadingSkeleton isLoading={isLoading} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#330074',
    paddingBottom: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 29,
    fontWeight: '700',
  },
  subtitle: {
    color: '#fff',
    fontSize: 18,
    marginTop: 8,
    marginBottom: 16,
  },
});
