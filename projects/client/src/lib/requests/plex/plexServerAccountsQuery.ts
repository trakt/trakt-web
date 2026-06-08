import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

type PlexServerAccountsParams = {
  serverId: string;
} & ApiParams;

export const PlexAccountSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const PlexLibrarySchema = z.object({
  id: z.number(),
  uuid: z.string(),
  type: z.string(),
  title: z.string(),
  agent: z.string(),
  scanner: z.string(),
  isSelected: z.boolean(),
  url: z.string(),
});

export const PlexServerAccountsSchema = z.object({
  accounts: z.array(PlexAccountSchema),
  libraries: z.array(PlexLibrarySchema),
});

export type PlexAccount = z.infer<typeof PlexAccountSchema>;
export type PlexLibrary = z.infer<typeof PlexLibrarySchema>;
export type PlexServerAccounts = z.infer<typeof PlexServerAccountsSchema>;

const plexServerAccountsRequest = (
  { serverId, fetch }: PlexServerAccountsParams,
) =>
  api({ fetch }).users.plex.serverAccounts({
    params: { server_id: serverId },
  });

export const plexServerAccountsQuery = defineQuery({
  key: 'plexServerAccounts',
  invalidations: [InvalidateAction.Plex.Settings],
  dependencies: (params) => [params.serverId],
  enabled: (params) => Boolean(params.serverId),
  request: plexServerAccountsRequest,
  mapper: (response) => ({
    accounts: response.body.accounts,
    libraries: response.body.libraries.map((lib) => ({
      id: lib.id,
      uuid: lib.uuid,
      type: lib.type,
      title: lib.title,
      agent: lib.agent,
      scanner: lib.scanner,
      isSelected: lib.selected,
      url: lib.url,
    })),
  }),
  schema: PlexServerAccountsSchema,
  ttl: time.minutes(5),
});
