import { api } from '../../../requests/api.ts';

import { env } from '$env/dynamic/private';
import {
  type DeviceAuth,
  mapToDeviceAuth,
} from '$lib/features/auth/requests/_internal/mapToDeviceAuth.ts';
import { DeviceUnauthorizedError } from '$lib/features/auth/requests/verifyAuth.ts';
import { print, PrintTarget } from '$lib/utils/console/print.ts';

export type PollingState = { state: 'pending' };
type PollingResponse = DeviceAuth | PollingState;

export async function verifyDeviceCode(
  deviceCode: string,
): Promise<PollingResponse> {
  const client_id = env.TRAKT_CLIENT_ID ?? '';
  const client_secret = env.TRAKT_CLIENT_SECRET ?? '';

  const tokenResponse = await api({
    environment: TRAKT_TARGET_ENVIRONMENT,
  }).oauth
    .device
    .token({
      body: {
        code: deviceCode,
        client_id,
        client_secret,
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
    switch (tokenResponse.status) {
      case 400:
        return { state: 'pending' };
      default: {
        print(PrintTarget.Worker, 'log', {
          unauthorizedResponse: tokenResponse,
        });

        throw new DeviceUnauthorizedError(
          'Access denied. The code holds no sway in this domain.',
        );
      }
    }
  }

  return mapToDeviceAuth(tokenResponse.body);
}
