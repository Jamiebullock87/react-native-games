export type Game = {
  id: string;
  title: string;
  thumbnailUrl: string;
  playUrl: string;
};

export type GetGamesOptions = {
  forceRefresh?: boolean;
};

export type GamesCache = {
  games: Game[];
  timestamp: number;
  expiresAt: number;
};
