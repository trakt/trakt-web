import { AuthDeviceEndpoint } from '$lib/features/auth/AuthDeviceEndpoint.ts';

export async function fetchAuthorizationStatus(code: string) {
  const response = await fetch(AuthDeviceEndpoint.Poll, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  return response;
}
