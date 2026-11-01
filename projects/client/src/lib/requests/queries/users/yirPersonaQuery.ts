import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { fetchReviewResource } from '../../_internal/fetchReviewResource.ts';
import { dummyYirPersonaResult } from '../../_internal/dummyYirPersonaResult.ts';
import { toYirPersonaAnswer } from '../../_internal/toYirPersonaAnswer.ts';
import { YirPersonaAnswerSchema } from '../../models/YirPersonaAnswer.ts';
import type { YirPersonaId } from '../../models/YirPersonaId.ts';

export type YirPersonaParams = {
  slug: string;
  year: number;
  slurm?: string;
  preview?: {
    persona: YirPersonaId;
    runnerUp?: YirPersonaId | null;
  };
} & ApiParams;

const yirPersonaRequest = async ({
  fetch,
  slug,
  year,
  slurm,
  preview,
}: YirPersonaParams) => {
  if (preview) {
    return {
      body: { isYearOpen: true, result: dummyYirPersonaResult(preview) },
      status: 200,
    };
  }

  const response = await fetchReviewResource({
    fetch,
    path: `/users/${slug}/yir/${year}/persona`,
    slurm,
  });

  return { body: await toYirPersonaAnswer(response), status: 200 };
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
  schema: YirPersonaAnswerSchema,
  ttl: time.hours(1),
});
