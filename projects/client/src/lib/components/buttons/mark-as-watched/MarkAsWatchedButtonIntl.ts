export type MarkAsWatchedButtonMeta = {
  title: string;
  isWatched: boolean;
  isRewatching: boolean;
};

export type MarkAsWatchedButtonIntl = {
  label: (meta: MarkAsWatchedButtonMeta) => string;
  text: (meta: MarkAsWatchedButtonMeta) => string;
};
