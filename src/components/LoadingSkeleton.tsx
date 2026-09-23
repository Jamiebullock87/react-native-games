import { useEffect, useState } from 'react';
import { Animated, StyleSheet, useAnimatedValue, View } from 'react-native';

const PLACEHOLDERS = Array.from({ length: 3 }, (_, index) => index);

type LoadingSkeletonProps = {
  isLoading: boolean;
};

export function LoadingSkeleton({ isLoading }: LoadingSkeletonProps) {
  const opacity = useAnimatedValue(1);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const animation = Animated.timing(opacity, {
      duration: 300,
      toValue: 0,
      useNativeDriver: true,
    });

    animation.start(({ finished }) => {
      if (finished) {
        setIsVisible(false);
      }
    });

    return () => animation.stop();
  }, [isLoading, opacity]);

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      accessibilityLabel="Loading games"
      accessibilityLiveRegion="polite"
      accessibilityRole="progressbar"
      accessibilityState={{ busy: true }}
      style={[styles.container, { opacity }]}>
      {PLACEHOLDERS.map((key) => (
        <View key={key} style={styles.card}>
          <View style={styles.image} />
          <View style={styles.line} />
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#330074',
    bottom: 0,
    gap: 16,
    left: 0,
    paddingHorizontal: 24,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    aspectRatio: 16 / 9,
    backgroundColor: '#e5e7eb',
    width: '100%',
  },
  line: {
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    height: 18,
    margin: 12,
    width: '55%',
  },
});
