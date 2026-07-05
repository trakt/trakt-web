import { rawApiFetch } from '$lib/requests/api.ts';

export async function deleteAccountRequest(): Promise<boolean> {
  const response = await rawApiFetch({
    path: '/users/settings',
    init: {
      method: 'DELETE',
    },
  });

  return response?.ok ?? false;
}
