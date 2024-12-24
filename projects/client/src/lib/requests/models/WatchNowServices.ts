type WatchNowService = {
  link: string;
  source: string;
  is4k: boolean;
};

export type WatchNowServices = {
  subscriptions: WatchNowService[];
};
