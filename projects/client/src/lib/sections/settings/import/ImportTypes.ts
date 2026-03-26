export type ImportSource =
  | 'imdb'
  | 'letterboxd'
  | 'tvtime'
  | 'trakt-json'
  | 'trakt-csv';

export type ImportAction = 'history' | 'watchlist' | 'ratings';

export type ImportType = 'movie' | 'show' | 'episode';

export type ImportStatus =
  | 'idle'
  | 'reading'
  | 'parsing'
  | 'review'
  | 'syncing'
  | 'complete'
  | 'error';

export interface ImportIds {
  trakt?: number;
  imdb?: string;
  tmdb?: number;
  tvdb?: number;
}

export interface UniversalImportItem {
  action: ImportAction;
  type: ImportType;
  ids: ImportIds;
  title?: string;
  year?: number;
  watched_at?: string;
  rating?: number;
  rated_at?: string;
  season?: number;
  episode?: number;
}

export interface ImportCounts {
  history: number;
  watchlist: number;
  ratings: number;
}

export interface ImportSourceConfig {
  id: ImportSource;
  accept: string;
  maxFiles: number;
}

export const IMPORT_SOURCE_CONFIGS: Record<
  ImportSource,
  ImportSourceConfig
> = {
  imdb: { id: 'imdb', accept: '.csv', maxFiles: 2 },
  letterboxd: { id: 'letterboxd', accept: '.zip', maxFiles: 1 },
  tvtime: { id: 'tvtime', accept: '.csv', maxFiles: 1 },
  'trakt-json': { id: 'trakt-json', accept: '.json', maxFiles: 1 },
  'trakt-csv': { id: 'trakt-csv', accept: '.csv', maxFiles: 1 },
};
