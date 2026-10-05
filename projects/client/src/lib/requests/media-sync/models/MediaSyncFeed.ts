import z from 'zod';

export const MediaSyncFeedSchema = z.enum([
  'history',
  'ratings',
  'collection',
  'watchlist',
]);

export type MediaSyncFeed = z.infer<typeof MediaSyncFeedSchema>;
