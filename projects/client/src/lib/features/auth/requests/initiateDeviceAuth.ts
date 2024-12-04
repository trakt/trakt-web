import { api } from '$lib/requests/_internal/api.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';

export type InitiateDeviceAuth = {
  url: HttpsUrl;
  interval: number;
  expireAt: number;
  code: string;
};

export const initiateDeviceAuth = async (): Promise<InitiateDeviceAuth> => {
  const response = await api()
    .oauth
    .device
    .code({
      body: {
        client_id: TRAKT_CLIENT_ID,
      },
    });

  if (response.status !== 200) {
    throw new Error('Failed to initiate device auth');
  }

  return {
    url: prependHttps(
      `${response.body.verification_url}/${response.body.user_code}`,
    ),
    code: response.body.device_code,
    interval: response.body.interval * 1000,
    expireAt: Date.now() + response.body.expires_in * 1000,
  };
};
