export type WatchNowButtonMeta = {
  isDisabled: boolean;
  title: string;
};

export type WatchNowButtonIntl = {
  title: (meta: WatchNowButtonMeta) => string;
  text: () => string;
};
