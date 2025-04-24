import type { SerializedAuthResponse } from '$lib/features/auth/models/SerializedAuthResponse.ts';
import type { DeviceAuth } from '$lib/features/auth/requests/_internal/mapToDeviceAuth.ts';
import { UNAUTHORIZED_PAYLOAD } from '$lib/features/auth/requests/authorize.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { warn as printWarning } from '$lib/utils/console/print.ts';

type EmptyAuth = {
  token: {
    access?: never;
    refresh?: never;
  };
  expiresAt?: never;
};

export function mapToSerializedAuthResponse(
  deviceAuth: DeviceAuth | EmptyAuth,
): SerializedAuthResponse {
  const isEmpty = deviceAuth.token?.access == null ||
    deviceAuth.token?.refresh == null ||
    deviceAuth.expiresAt == null;

  if (isEmpty) {
    printWarning(
      'Empty response received from the server.',
      { emptyResponseToken: deviceAuth },
    );
    return UNAUTHORIZED_PAYLOAD;
  }

  return {
    token: {
      access: assertDefined(
        deviceAuth.token.access,
        'Access token should be defined',
      ),
      refresh: assertDefined(
        deviceAuth.token.refresh,
        'Refresh token should be defined',
      ),
    },
    isAuthorized: true,
    expiresAt: deviceAuth.expiresAt,
  };
}
