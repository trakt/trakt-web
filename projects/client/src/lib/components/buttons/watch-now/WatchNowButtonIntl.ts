export type WatchNowButtonMeta = {
  count: number;
  isDisabled: boolean;
};

export type WatchNowButtonIntl = {
  title: (title: string) => string;
  watchNow: () => string;
  watchOnMultiple: ({ count, isDisabled }: WatchNowButtonMeta) => string;
};
