import { env } from '$env/dynamic/private';
import { api } from '../../../requests/api.ts';
import type { AuthToken } from '../models/AuthToken.ts';
import { getGrantTypeAndCode } from './_internal/getGrantTypeAndCode.ts';

export type DeviceAuth = {
  token: {
    access: string;
    refresh: string;
  };
  expiresAt: number;
};

export class DeviceUnauthorizedError extends Error {}

type VerifyAuthParams = {
  referrer: string;
  token: AuthToken;
};

export async function verifyAuth({
  referrer: redirect_uri,
  token,
}: VerifyAuthParams): Promise<DeviceAuth> {
  const client_secret = env.TRAKT_CLIENT_SECRET ?? '';
  const client_id = env.TRAKT_CLIENT_ID ?? '';

  const tokenResponse = await api({
    environment: TRAKT_TARGET_ENVIRONMENT,
  })
    .oauth
    .token({
      body: {
        client_id,
        client_secret,
        redirect_uri,
        ...getGrantTypeAndCode(token),
      },
    })
    .catch(() => {
      // Trakt API does not return a correct body for 400 responses
      // throws error when trying to parse JSON
      return Promise.resolve(
        { status: 400, body: undefined } as {
          status: 400;
          body: undefined;
        },
      );
    });

  if (tokenResponse.status !== 200) {
    throw new DeviceUnauthorizedError(
      'Access denied. The code holds no sway in this domain.',
    );
  }

  return {
    token: {
      access: tokenResponse.body.access_token,
      refresh: tokenResponse.body.refresh_token,
    },
    expiresAt: Date.now() + tokenResponse.body.expires_in * 1000,
  };
}
