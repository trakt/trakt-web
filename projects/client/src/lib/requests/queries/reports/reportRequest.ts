import { ReportableType } from '$lib/features/report/models/ReportableType.ts';
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

// The SDK router is the pluralized type for every reportable except person,
// which lives under the `people` router. Mapped explicitly so the key stays a
// string literal the typed API proxy can index.
const reportRouter = {
  [ReportableType.Comment]: 'comments',
  [ReportableType.Movie]: 'movies',
  [ReportableType.Show]: 'shows',
  [ReportableType.Season]: 'seasons',
  [ReportableType.Episode]: 'episodes',
  [ReportableType.Person]: 'people',
  [ReportableType.List]: 'lists',
  [ReportableType.User]: 'users',
} as const satisfies Record<ReportableType, string>;

export async function reportRequest(
  { fetch, params, reason, message }: ReportRequestParams,
): Promise<ReportRequestResult> {
  const response = await api({ fetch })[reportRouter[params.type]]
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
