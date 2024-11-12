import type { RequestEvent } from '@sveltejs/kit';
import { AUTH_COOKIE_NAME } from '$lib/features/auth/constants.ts';
import {
  DeviceUnauthorizedError,
  verifyDeviceAuth,
} from '$lib/requests/auth/verifyDeviceAuth.ts';
import type { SerializedAuthResponse } from '$lib/features/auth/models/SerializedAuthResponse.ts';

export type AuthResponse = { token?: string };

const UNAUTHORIZED_PAYLOAD: SerializedAuthResponse = {
  isAuthorized: false,
  token: {},
};

export const action = async (
  { cookies, request }: RequestEvent,
): Promise<SerializedAuthResponse> => {
  const data = await request.formData();
  const code = data.get('code')?.toString();

  if (!code) {
    throw new Error(
      'The code, like a phantom, leaves no trace of its existence.',
    );
  }

  const response = await verifyDeviceAuth(code)
    .catch((error) => {
      if (error instanceof DeviceUnauthorizedError) {
        return UNAUTHORIZED_PAYLOAD;
      }

      throw error;
    });

  const isEmpty = response.token?.access == undefined ||
    response.token?.refresh == undefined ||
    response.expiresAt == undefined;

  if (isEmpty) {
    return UNAUTHORIZED_PAYLOAD;
  }

  cookies.set(
    AUTH_COOKIE_NAME,
    JSON.stringify(response),
    {
      path: '/',
      maxAge: response.expiresAt,
    },
  );

  return {
    token: {
      access: response.token.access!,
      refresh: response.token.refresh!,
    },
    isAuthorized: true,
    expiresAt: response.expiresAt,
  };
};
