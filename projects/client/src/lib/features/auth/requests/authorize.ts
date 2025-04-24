import type { SerializedAuthResponse } from '$lib/features/auth/models/SerializedAuthResponse.ts';
import { mapToSerializedAuthResponse } from '$lib/features/auth/requests/_internal/mapToSerializedAuthResponse.ts';
import {
  error as printError,
  print,
  PrintTarget,
} from '$lib/utils/console/print.ts';
import type { AuthToken } from '../models/AuthToken.ts';
import { DeviceUnauthorizedError, verifyAuth } from './verifyAuth.ts';

export const UNAUTHORIZED_PAYLOAD: SerializedAuthResponse = {
  isAuthorized: false,
  token: {},
};

type AuthorizeParams = {
  referrer: string;
  token: AuthToken;
};

function hasValidTokenCode(token: AuthToken) {
  if (token.type === 'exchange') {
    return Boolean(token.code);
  }

  return Boolean(token.refreshToken);
}

export const authorize = async ({
  referrer,
  token,
}: AuthorizeParams): Promise<SerializedAuthResponse> => {
  if (!hasValidTokenCode(token)) {
    throw new Error(
      'The code, like a phantom, leaves no trace of its existence.',
    );
  }

  const response = await verifyAuth({ referrer, token })
    .catch((error) => {
      print(PrintTarget.Worker, 'log', { authError: error });

      if (error instanceof DeviceUnauthorizedError) {
        return UNAUTHORIZED_PAYLOAD;
      }

      printError('Error verifying device auth:', error.message);

      throw error;
    });

  return mapToSerializedAuthResponse(response);
};
