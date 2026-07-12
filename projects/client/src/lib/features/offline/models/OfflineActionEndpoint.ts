import { z } from 'zod';

export const OfflineActionEndpointSchema = z.enum([
  'history:add',
  'history:remove',
  'watchlist:add',
  'watchlist:remove',
  'rating:add',
  'rating:remove',
  'favorites:add',
  'favorites:remove',
]);

export type OfflineActionEndpoint = z.infer<typeof OfflineActionEndpointSchema>;

export type OfflineActionDomain = OfflineActionEndpoint extends
  `${infer TDomain}:${string}` ? TDomain : never;
