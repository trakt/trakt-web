export type ShareType = 'open-graph' | 'feed' | 'story';

type ShareDimensions = {
  width: number;
  height: number;
  padding: number;
};

export const SHARE_TYPE_DIMENSIONS: Record<ShareType, ShareDimensions> = {
  'open-graph': { width: 1200, height: 630, padding: 50 },
  'feed': { width: 1080, height: 1080, padding: 40 },
  'story': { width: 1080, height: 1920, padding: 60 },
};
