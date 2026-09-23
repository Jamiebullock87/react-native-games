import { useCallback, useEffect, useState } from 'react';

import { getGames } from './api';
import type { Game } from './types';

type UseGamesResult = {
  games: Game[];
  hasError: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
};

export function useGames(): UseGamesResult {
  const [games, setGames] = useState<Game[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setHasError(false);
    setIsRefreshing(true);

    try {
      setGames(await getGames({ forceRefresh: true }));
    } catch {
      setHasError(true);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    getGames()
      .then((nextGames) => {
        if (isActive) {
          setGames(nextGames);
        }
      })
      .catch(() => {
        if (isActive) {
          setHasError(true);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { games, hasError, isLoading, isRefreshing, refresh };
}
