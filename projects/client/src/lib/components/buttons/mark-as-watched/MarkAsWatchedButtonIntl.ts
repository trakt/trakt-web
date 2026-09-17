export type MarkAsWatchedButtonMeta = {
  title: string;
  isRemovable: boolean;
  isRewatching: boolean;
};

export type MarkAsWatchedButtonIntl = {
  label: (meta: MarkAsWatchedButtonMeta) => string;
  text: (meta: MarkAsWatchedButtonMeta) => string;
};
