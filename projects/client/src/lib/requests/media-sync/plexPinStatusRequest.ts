import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import z from 'zod';

const PlexPinStatusSchema = z.object({
  status: z.enum(['pending', 'claimed']),
  account_name: z.string().nullable(),
  servers: z.array(z.object({
    id: z.string(),
    name: z.string(),
    owned: z.boolean(),
    reachable: z.boolean(),
  })).nullable(),
});

export type PlexServerOption = {
  id: string;
  name: string;
  owned: boolean;
  reachable: boolean;
};

export type PlexPinStatus =
  | { status: 'pending' }
  | {
    status: 'claimed';
    accountName: string | null;
    servers: PlexServerOption[];
  };

export async function plexPinStatusRequest(
  { fetch, attemptId }: { attemptId: string } & ApiParams,
): Promise<PlexPinStatus> {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/sync/plex/pin/${attemptId}`,
  });
  if (!response.ok) {
    throw new Error(`Failed to check Plex sign-in: ${response.status}`);
  }
  const body = PlexPinStatusSchema.parse(await response.json());
  return body.status === 'pending' ? { status: 'pending' } : {
    status: 'claimed',
    accountName: body.account_name,
    servers: body.servers ?? [],
  };
}
