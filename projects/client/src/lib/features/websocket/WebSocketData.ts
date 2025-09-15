type WebSocketKey =
  | 'show:watchlist'
  | 'movie:watchlist'
  | 'episode:watched'
  | 'movie:watched';

export type WebSocketData = {
  key: WebSocketKey;
};
