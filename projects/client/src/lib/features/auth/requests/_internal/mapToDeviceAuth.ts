import type { OAuthTokenResponse } from '@trakt/api';

export type DeviceAuth = {
  token: {
    access: string;
    refresh: string;
  };
  expiresAt: number;
};

export function mapToDeviceAuth(response: OAuthTokenResponse): DeviceAuth {
  return {
    token: {
      access: response.access_token,
      refresh: response.refresh_token,
    },
    expiresAt: Date.now() + response.expires_in * 1000,
  };
}
