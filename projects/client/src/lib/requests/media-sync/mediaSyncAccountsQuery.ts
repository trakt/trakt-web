import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import { InvalidateAction } from '../models/InvalidateAction.ts';
import {
  type MediaSyncAccount,
  MediaSyncAccountSchema,
} from './models/MediaSyncAccount.ts';

type MediaSyncAccountsParams = { connectionId: number } & ApiParams;

export const MediaSyncAccountResponseSchema = z.object({
  account_id: z.string(),
  name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  owner: z.boolean(),
  selected: z.boolean(),
});

type MediaSyncAccountResponse = z.infer<typeof MediaSyncAccountResponseSchema>;

export function mapToMediaSyncAccount(
  account: MediaSyncAccountResponse,
): MediaSyncAccount {
  return {
    accountId: account.account_id,
    name: account.name,
    avatarUrl: account.avatar_url,
    owner: account.owner,
    selected: account.selected,
  };
}

const mediaSyncAccountsRequest = async (
  { fetch, connectionId }: MediaSyncAccountsParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/sync/connections/${connectionId}/accounts`,
  });
  if (!response.ok) {
    throw new Error(`Failed to load Plex profiles: ${response.status}`);
  }
  return {
    body: z.array(MediaSyncAccountResponseSchema).parse(await response.json()),
    status: 200,
  };
};

export const mediaSyncAccountsQuery = defineQuery({
  key: 'mediaSyncAccounts',
  invalidations: [InvalidateAction.MediaSync.Connections],
  dependencies: (params) => [params.connectionId],
  request: mediaSyncAccountsRequest,
  mapper: (response) => response.body.map(mapToMediaSyncAccount),
  schema: z.array(MediaSyncAccountSchema),
  ttl: time.minutes(5),
});
