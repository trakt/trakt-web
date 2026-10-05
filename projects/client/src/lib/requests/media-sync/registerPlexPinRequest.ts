import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import z from 'zod';
import type { PlexPin } from './createPlexPinRequest.ts';

const RegisteredPinSchema = z.object({
  id: z.string(),
  auth_url: z.string(),
  expires_in: z.number(),
});

export type RegisteredPlexPin = {
  attemptId: string;
  authUrl: string;
  expiresIn: number;
};

export async function registerPlexPinRequest(
  { fetch, pin }: { pin: PlexPin } & ApiParams,
): Promise<RegisteredPlexPin> {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/users/me/sync/plex/pin',
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: pin.id, code: pin.code }),
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to register Plex sign-in: ${response.status}`);
  }
  const body = RegisteredPinSchema.parse(await response.json());
  return {
    attemptId: body.id,
    authUrl: body.auth_url,
    expiresIn: body.expires_in,
  };
}
