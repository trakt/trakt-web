type BaseService = {
  link: string;
  source: string;
  is4k: boolean;
  type: 'streaming' | 'on-demand';
};

export type WatchNowService = BaseService & {
  type: 'streaming';
};

export type WatchNowOnDemand = BaseService & {
  type: 'on-demand';
  currency: string;
  prices: {
    rent?: number;
    purchase?: number;
  };
};

export type WatchNowServices = {
  streamingServices: WatchNowService[];
  onDemandServices: WatchNowOnDemand[];
};
