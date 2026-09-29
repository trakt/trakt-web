import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { dummyYirPersonaResult } from '../../_internal/dummyYirPersonaResult.ts';
import type { YirPersonaId } from '../../models/YirPersonaId.ts';
import { YirPersonaResultSchema } from '../../models/YirPersonaResult.ts';

export type YirPersonaParams = {
  slug: string;
  year: number;
  preview?: {
    persona: YirPersonaId;
    runnerUp?: YirPersonaId | null;
  };
} & ApiParams;

// FIXME: add GET /users/{slug}/yir/{year}/persona to workers (persona,
// runnerUp, confidence, rarity, traits, highlights, runnerUpHighlights,
// scores, streak, monthly),
// computed in the yir batch job next to yir_stats, then fetch it here via
// fetchReviewResource like yirDetailQuery. Responses are mocked until then.
const yirPersonaRequest = (
  { preview }: YirPersonaParams,
) =>
  Promise.resolve({
    body: dummyYirPersonaResult(preview ?? { persona: 'anime-voyager' }),
    status: 200,
  });

export const yirPersonaQuery = defineQuery({
  key: 'yirPersona',
  invalidations: [],
  dependencies: (params) => [
    params.slug,
    params.year,
    params.preview?.persona,
    params.preview?.runnerUp,
  ],
  request: yirPersonaRequest,
  mapper: (response) => response.body,
  schema: YirPersonaResultSchema.nullable(),
  ttl: time.hours(1),
});
