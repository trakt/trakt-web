import { z } from 'zod';

const PROMOTION_SOURCE_PATTERN = /^promotion-[a-z0-9-]{1,48}$/;

export const VipUpsellSourceSchema = z.union([
  z.enum([
    'all-time-stats',
    'connected-apps',
    'direct',
    'footer',
    'import',
    'leaderboard-viewer',
    'library-collection-limit',
    'lists',
    'mir',
    'navbar',
    'navbar-mobile',
    'plex-settings-add-server',
    'plex-settings-collection-limit',
    'plex-settings-sync',
    'plex-settings-webhook',
    'preview-features',
    'profile-settings',
    'sentiment',
    'smart-list',
    'soundtrack',
    'soundtrack-drawer',
    'streaming-services-settings',
    'trivia',
    'welcome',
    'welcome-banner',
    'yir',
    'yir-all-time',
  ]),
  z.custom<`promotion-${string}`>(
    (value) =>
      typeof value === 'string' && PROMOTION_SOURCE_PATTERN.test(value),
  ),
]);

export type VipUpsellSource = z.infer<typeof VipUpsellSourceSchema>;
