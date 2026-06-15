type WebSocketKey =
  | 'show:watchlist'
  | 'movie:watchlist'
  | 'episode:watched'
  | 'movie:watched'
  | 'account:settings';

export type WebSocketData = {
  key: WebSocketKey;
};
