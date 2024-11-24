import type { SerializedAuthResponse } from '$lib/features/auth/models/SerializedAuthResponse.ts';
import {
  DeviceUnauthorizedError,
  verifyDeviceAuth,
} from './verifyDeviceAuth.ts';

export type AuthResponse = { token?: string };

const UNAUTHORIZED_PAYLOAD: SerializedAuthResponse = {
  isAuthorized: false,
  token: {},
};

export const authorize = async (
  code: string,
): Promise<SerializedAuthResponse> => {
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

      console.error('Error verifying device auth:', error.message);

      throw error;
    });

  const isEmpty = response.token?.access == undefined ||
    response.token?.refresh == undefined ||
    response.expiresAt == undefined;

  if (isEmpty) {
    return UNAUTHORIZED_PAYLOAD;
  }

  return {
    token: {
      access: response.token.access!,
      refresh: response.token.refresh!,
    },
    isAuthorized: true,
    expiresAt: response.expiresAt,
  };
};
