import { parse } from 'node-html-parser';

import type { Game, GamesCache, GetGamesOptions } from './types';

export const GAMES_SOURCE_URL = 'https://html5games.com/';
export const CACHE_TTL_MS = 60 * 60 * 1000;

let cache: GamesCache | null = null;
let inFlightRequest: Promise<Game[]> | null = null;

export function getGames(options: GetGamesOptions = {}): Promise<Game[]> {
  if (cache && !options.forceRefresh && Date.now() < cache.expiresAt) {
    return Promise.resolve(cache.games);
  }

  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = fetch(GAMES_SOURCE_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch games: ${response.status}`);
      }

      return response.text();
    })
    .then((html) => {
      const games = parseGames(html);

      cache = {
        games,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_TTL_MS,
      };

      return games;
    })
    .finally(() => {
      inFlightRequest = null;
    });

  return inFlightRequest;
}


export function parseGames(html: string): Game[] {
  const document = parse(html);
  const links = document.querySelectorAll(
    'ul.games-special a[href^="/Game/"]',
  );

  return links.flatMap((link) => {
    const href = link.getAttribute('href');
    const image = link.querySelector('img');

    if (!href || !image) {
      return [];
    }

    const [section, slug, id] = href.split('/').filter(Boolean);
    const thumbnailUrl = image.getAttribute('src');
    const title = image.getAttribute('alt');

    if (section !== 'Game' || !slug || !id || !thumbnailUrl || !title) {
      return [];
    }

    return [
      {
        id,
        title,
        thumbnailUrl,
        playUrl: `https://play.famobi.com/${slug.toLowerCase()}`,
      },
    ];
  });
}

export function clearGamesCache(): void {
  // Useful for development and future tests.
  cache = null;
  inFlightRequest = null;
}
