export type RemoveFromHistoryButtonMeta = {
  title: string;
};

export type RemoveFromHistoryButtonIntl = {
  label: (meta: RemoveFromHistoryButtonMeta) => string;
  text: () => string;
};
