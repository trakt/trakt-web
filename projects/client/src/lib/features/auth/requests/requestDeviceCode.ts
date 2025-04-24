import { print, PrintTarget } from '$lib/utils/console/print.ts';
import { api } from '../../../requests/api.ts';

import { env } from '$env/dynamic/private';

export type DeviceCodeResponse = {
  url: string;
  userCode: string;
  expiresIn: number;
  deviceCode: string;
  interval: number;
  isRejected: false;
} | {
  isRejected: true;
};

export async function requestDeviceCode(): Promise<DeviceCodeResponse> {
  const client_id = env.TRAKT_CLIENT_ID ?? '';

  const codeResponse = await api({
    environment: TRAKT_TARGET_ENVIRONMENT,
  }).oauth
    .device
    .code({
      body: {
        client_id,
      },
    });

  if (codeResponse.status !== 200) {
    print(PrintTarget.Worker, 'log', {
      rejectedDeviceCodeResponse: codeResponse,
    });

    return {
      isRejected: true,
    };
  }

  return {
    isRejected: false,
    url: codeResponse.body.verification_url,
    userCode: codeResponse.body.user_code,
    expiresIn: codeResponse.body.expires_in,
    deviceCode: codeResponse.body.device_code,
    interval: codeResponse.body.interval,
  };
}
