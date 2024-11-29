export type MarkAsWatchedButtonMeta = {
  title: string;
};

export type MarkAsWatchedButtonIntl = {
  label: (meta: MarkAsWatchedButtonMeta) => string;
  text: (meta: MarkAsWatchedButtonMeta) => string;
};
