import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text } from 'react-native';

import type { Game } from '@/features/games/types';

type GameCardProps = {
  game: Game;
  onPress: (game: Game) => void;
};

export const GameCard = memo(function GameCard({
  game,
  onPress,
}: GameCardProps) {
  return (
    <Pressable
      accessibilityHint="Opens the game in full screen"
      accessibilityLabel={`Play ${game.title}`}
      accessibilityRole="button"
      onPress={() => onPress(game)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <Image
        accessibilityIgnoresInvertColors
        accessible={false}
        source={{ uri: game.thumbnailUrl }}
        style={styles.image}
      />
      <Text style={styles.title}>{game.title}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 2,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16
  },
  cardPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
  image: {
    aspectRatio: 16 / 9,
    backgroundColor: '#e5e7eb',
    width: '100%',
  },
  title: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
    padding: 12,
  },
});
