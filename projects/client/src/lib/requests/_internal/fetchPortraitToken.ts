import { rawApiFetch, type ApiParams } from '$lib/requests/api.ts';
import { z } from 'zod';

const PortraitTokenResponseSchema = z.object({
  token: z.string(),
});

export async function fetchPortraitToken({
  fetch,
}: ApiParams): Promise<string | null> {
  const response = await rawApiFetch({
    fetch,
    path: '/portraits/token',
    authenticated: false,
  }).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  const parsed = PortraitTokenResponseSchema.safeParse(
    await response.json().catch(() => null),
  );

  return parsed.success ? parsed.data.token : null;
}
