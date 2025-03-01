export type MarkAsWatchedButtonMeta = {
  title: string;
  isWatched: boolean;
};

export type MarkAsWatchedButtonIntl = {
  label: (meta: MarkAsWatchedButtonMeta) => string;
  text: (meta: MarkAsWatchedButtonMeta) => string;
};
