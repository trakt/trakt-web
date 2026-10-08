import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { fetchReviewResource } from '../../_internal/fetchReviewResource.ts';
import { dummyYirPersonaResult } from '../../_internal/dummyYirPersonaResult.ts';
import { mapToYirPersonaResult } from '../../_internal/mapToYirPersonaResult.ts';
import type { YirPersonaId } from '../../models/YirPersonaId.ts';
import { YirPersonaResultSchema } from '../../models/YirPersonaResult.ts';

export type YirPersonaParams = {
  slug: string;
  year: number;
  slurm?: string;
  preview?: {
    persona: YirPersonaId;
    runnerUp?: YirPersonaId | null;
  };
} & ApiParams;

const yirPersonaRequest = async (
  { fetch, slug, year, slurm, preview }: YirPersonaParams,
) => {
  if (preview) {
    return {
      body: dummyYirPersonaResult(preview),
      status: 200,
    };
  }

  const response = await fetchReviewResource({
    fetch,
    path: `/users/${slug}/yir/${year}/persona`,
    slurm,
  });

  return response.ok
    ? { body: mapToYirPersonaResult(await response.json()), status: 200 }
    : { body: null, status: 200 };
};

export const yirPersonaQuery = defineQuery({
  key: 'yirPersona',
  invalidations: [],
  dependencies: (params) => [
    params.slug,
    params.year,
    params.slurm,
    params.preview?.persona,
    params.preview?.runnerUp,
  ],
  request: yirPersonaRequest,
  mapper: (response) => response.body,
  schema: YirPersonaResultSchema.nullable(),
  ttl: time.hours(1),
});
