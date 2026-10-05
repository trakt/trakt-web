import z from 'zod';
import { MediaSyncFeedSchema } from './MediaSyncFeed.ts';

export const MediaSyncLibrarySchema = z.object({
  id: z.number(),
  externalId: z.string(),
  kind: z.enum(['movies', 'shows']),
  title: z.string(),
  enabled: z.boolean(),
  itemCount: z.number().nullable(),
});

export const MediaSyncConnectionSchema = z.object({
  id: z.number(),
  provider: z.enum(['plex', 'jellyfin']),
  status: z.enum([
    'active',
    'paused',
    'unreachable',
    'unauthorized',
    'disconnected',
  ]),
  serverId: z.string(),
  serverName: z.string().nullable(),
  accountName: z.string().nullable(),
  feeds: z.array(MediaSyncFeedSchema),
  libraries: z.array(MediaSyncLibrarySchema),
  failureCount: z.number(),
  lastFailureKind: z.string().nullable(),
  collectionLimitReached: z.boolean(),
  lastSyncedAt: z.date().nullable(),
  nextSyncAt: z.date(),
});

export type MediaSyncLibrary = z.infer<typeof MediaSyncLibrarySchema>;
export type MediaSyncConnection = z.infer<typeof MediaSyncConnectionSchema>;
