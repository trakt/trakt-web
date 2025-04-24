import type { SerializedAuthResponse } from '$lib/features/auth/models/SerializedAuthResponse.ts';
import { mapToSerializedAuthResponse } from '$lib/features/auth/requests/_internal/mapToSerializedAuthResponse.ts';
import { UNAUTHORIZED_PAYLOAD } from '$lib/features/auth/requests/authorize.ts';
import {
  DeviceUnauthorizedError,
} from '$lib/features/auth/requests/verifyAuth.ts';
import {
  type PollingState,
  verifyDeviceCode,
} from '$lib/features/auth/requests/verifyDeviceCode.ts';
import { error as printError } from '$lib/utils/console/print.ts';

export async function authorizeDeviceCode(
  deviceCode: string,
): Promise<SerializedAuthResponse | PollingState> {
  const response = await verifyDeviceCode(deviceCode)
    .catch((error) => {
      if (error instanceof DeviceUnauthorizedError) {
        return UNAUTHORIZED_PAYLOAD;
      }

      printError('Error verifying device token auth:', error.message);

      throw error;
    });

  if ('state' in response) {
    return {
      state: response.state,
    };
  }

  return mapToSerializedAuthResponse(response);
}
