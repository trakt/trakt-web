import type { ReportParams } from '$lib/features/report/models/ReportParams.ts';
import type { ReportReason } from '$lib/features/report/models/ReportReason.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';

type ReportRequestParams = {
  params: ReportParams;
  reason: ReportReason;
  message: string;
} & ApiParams;

export type ReportRequestResult =
  | { ok: true }
  | { ok: false; status: number };

export async function reportRequest(
  { fetch, params, reason, message }: ReportRequestParams,
): Promise<ReportRequestResult> {
  const response = await api({ fetch })[`${params.type}s`]
    .report({
      params: { id: `${params.id}` },
      // FIXME: typings here need to be tied to the type, e.g. if type
      // is comment, it reason should be typed to comment reasons
      body: { reason: reason as 'other', message },
    });

  if (response.status === 201) {
    return { ok: true };
  }

  return { ok: false, status: response.status };
}
