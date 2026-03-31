export type ShareType = 'open-graph';

type ShareDimensions = {
  width: number;
  height: number;
  padding: number;
};

export const SHARE_TYPE_DIMENSIONS: Record<ShareType, ShareDimensions> = {
  'open-graph': { width: 1200, height: 630, padding: 50 },
};
