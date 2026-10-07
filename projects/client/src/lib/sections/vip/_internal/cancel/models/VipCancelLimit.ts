export type VipCancelLimit = Readonly<{
  item:
    | 'watchlist'
    | 'collection'
    | 'notes'
    | 'smart-lists'
    | 'connected-apps';
  current: number;
  free: number;
  vip: number;
}>;
