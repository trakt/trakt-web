export type VipCancelLimit = {
  item:
    | 'watchlist'
    | 'collection'
    | 'notes'
    | 'smart-lists'
    | 'connected-apps';
  current: number;
  free: number;
  vip: number;
};
