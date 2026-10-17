import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { type Mixtape, MixtapeSchema } from '$lib/requests/models/Mixtape.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { mapToMixtapeMedia } from './_internal/mapToMixtapeMedia.ts';
import { MixtapeMediaResponseSchema } from './_internal/MixtapeMediaResponseSchema.ts';

const MixtapeResponseSchema = z.object({
  fits: z.array(
    MixtapeMediaResponseSchema.extend({ id: z.number(), score: z.number() }),
  ),
  suggestions: z.array(
    MixtapeMediaResponseSchema.extend({
      because: z.number(),
      match: z.number(),
    }),
  ),
});

type MixtapeParams = {
  type: MediaType;
  picks: ReadonlyArray<number>;
  candidates: ReadonlyArray<number>;
  suggestions: boolean;
} & ApiParams;

const mixtapeRequest = async (
  { fetch, type, picks, candidates, suggestions }: MixtapeParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/mixtape?extended=full,images',
    init: {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type, picks, candidates, suggestions }),
    },
  });

  return response.ok
    ? {
      body: MixtapeResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: undefined, status: 200 };
};

export const mixtapeQuery = defineQuery({
  key: 'mixtape',
  invalidations: [],
  dependencies: (params: MixtapeParams) => [
    params.type,
    params.picks.join(','),
    params.candidates.join(','),
    params.suggestions,
  ],
  request: mixtapeRequest,
  mapper: (response): Mixtape => ({
    fits: (response.body?.fits ?? []).map((fit) => ({
      id: fit.id,
      score: fit.score,
      media: mapToMixtapeMedia(fit) ?? undefined,
    })),
    suggestions: (response.body?.suggestions ?? []).flatMap((suggestion) => {
      const media = mapToMixtapeMedia(suggestion);
      return media
        ? [{ media, because: suggestion.because, match: suggestion.match }]
        : [];
    }),
  }),
  schema: MixtapeSchema,
  ttl: time.minutes(30),
  enabled: (params: MixtapeParams) => params.picks.length > 0,
});
