import { pluralPath } from '$lib/features/report/_internal/pluralPath.ts';
import type { ReportParams } from '$lib/features/report/models/ReportParams.ts';
import type { ReportReason } from '$lib/features/report/models/ReportReason.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

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
  const response = await rawApiFetch({
    fetch,
    path: `/${pluralPath(params.type)}/${params.id}/report`,
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, message }),
    },
  });

  if (response.ok) {
    return { ok: true };
  }

  return { ok: false, status: response.status };
}
