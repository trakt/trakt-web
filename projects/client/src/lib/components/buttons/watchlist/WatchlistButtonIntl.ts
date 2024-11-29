export type WatchlistButtonMeta = {
  isWatchlisted: boolean;
  title: string;
};

export type WatchlistButtonIntl = {
  label: (meta: WatchlistButtonMeta) => string;
  text: (meta: WatchlistButtonMeta) => string;
};
