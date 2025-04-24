import { AuthDeviceEndpoint } from '$lib/features/auth/AuthDeviceEndpoint.ts';
import type { DeviceCodeResponse } from '$lib/features/auth/requests/requestDeviceCode.ts';

export async function fetchActivationDetails() {
  const response = await fetch(AuthDeviceEndpoint.Get, { method: 'GET' });
  return (await response.json()) as DeviceCodeResponse;
}
