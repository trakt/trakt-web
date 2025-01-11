import type { SerializedAuthResponse } from '$lib/features/auth/models/SerializedAuthResponse.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { DeviceUnauthorizedError, verifyAuth } from './verifyAuth.ts';

const UNAUTHORIZED_PAYLOAD: SerializedAuthResponse = {
  isAuthorized: false,
  token: {},
};

type AuthorizeParams = {
  code: string;
  referrer: string;
};

export const authorize = async ({
  code,
  referrer: redirect_uri,
}: AuthorizeParams): Promise<SerializedAuthResponse> => {
  if (!code) {
    throw new Error(
      'The code, like a phantom, leaves no trace of its existence.',
    );
  }

  const response = await verifyAuth({ code, redirect_uri })
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
      access: assertDefined(
        response.token.access,
        'Access token should be defined',
      ),
      refresh: assertDefined(
        response.token.refresh,
        'Refresh token should be defined',
      ),
    },
    isAuthorized: true,
    expiresAt: response.expiresAt,
  };
};
