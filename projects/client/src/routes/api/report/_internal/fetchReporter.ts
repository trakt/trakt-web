import { rawApiFetch } from '$lib/requests/api.ts';
import { z } from 'zod';
import type { Reporter } from './ReportSubmission.ts';

const SettingsUserSchema = z.object({
  user: z.object({
    username: z.string(),
    ids: z.object({
      trakt: z.number().nullish(),
      uuid: z.string().nullish(),
    }),
    vip: z.boolean().nullish(),
    vip_ep: z.boolean().nullish(),
  }),
});

type FetchReporterParams = {
  token: string;
  fetch: typeof fetch;
};

export async function fetchReporter({
  token,
  fetch,
}: FetchReporterParams): Promise<Reporter | null> {
  const response = await rawApiFetch({
    fetch,
    path: '/users/settings',
    authenticated: false,
    init: { headers: { Authorization: `Bearer ${token}` } },
  }).catch(() => null);

  if (!response?.ok) return null;

  const parsed = SettingsUserSchema.safeParse(
    await response.json().catch(() => null),
  );
  if (!parsed.success) return null;

  const { user } = parsed.data;
  const id = user.ids.trakt ?? user.ids.uuid;
  if (id == null) return null;

  return {
    userId: String(id),
    username: user.username,
    isVip: Boolean(user.vip || user.vip_ep),
  };
}
