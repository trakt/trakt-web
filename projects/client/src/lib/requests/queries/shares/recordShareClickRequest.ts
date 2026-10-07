import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { z } from 'zod';
import {
  type ShareClickOutcome,
  ShareClickOutcomeSchema,
} from '../../models/ShareClickOutcome.ts';

type RecordShareClickParams = {
  body: { code: string; url: string };
} & ApiParams;

export async function recordShareClickRequest(
  { fetch, body }: RecordShareClickParams,
): Promise<ShareClickOutcome | null> {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/shares/click',
    init: {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' },
    },
  });

  if (!response.ok) return null;

  const parsed = z.object({ outcome: ShareClickOutcomeSchema }).safeParse(
    await response.json(),
  );
  return parsed.success ? parsed.data.outcome : null;
}
