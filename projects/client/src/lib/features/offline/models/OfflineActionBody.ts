import type {
  FavoritesRequest,
  HistoryAddRequest,
  HistoryRemoveRequest,
  RatingsSyncRequest,
  RemoveRatingsParams,
  WatchlistRequest,
} from '@trakt/api';

export type OfflineActionBody = {
  'history:add': HistoryAddRequest;
  'history:remove': HistoryRemoveRequest;
  'watchlist:add': WatchlistRequest;
  'watchlist:remove': WatchlistRequest;
  'rating:add': RatingsSyncRequest;
  'rating:remove': RemoveRatingsParams;
  'favorites:add': FavoritesRequest;
  'favorites:remove': FavoritesRequest;
};
