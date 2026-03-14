import { rawApiFetch } from '$lib/requests/api.ts';

type ChangeEmailParams = {
  email: string;
};

export async function changeEmailRequest(
  { email }: ChangeEmailParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    path: '/users/email',
    init: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account: {
          email,
        },
      }),
    },
  });

  return response?.ok ?? false;
}
