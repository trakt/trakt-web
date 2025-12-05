import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import type { ExtendedMediaType } from '../../models/ExtendedMediaType.ts';

type UserPlexStreamParams = ApiParams & {
  type: ExtendedMediaType;
  slug: string;
};

const UserPlexStreamResponseSchema = z.object({
  matched_by: z.object({
    type: z.string(),
    value: z.string(),
  }),
  stream_url: z.string(),
});

const UserPlexStreamSchema = z.object({
  src: z.string(),
});

export type UserPlexStream = z.infer<typeof UserPlexStreamSchema>;

type UserPlexStreamResponse = z.infer<typeof UserPlexStreamResponseSchema>;

const userPlexStreamRequest = async (
  { fetch, slug, type }: UserPlexStreamParams,
) => {
  const response = await rawApiFetch(
    { fetch, path: `/users/me/plex/stream/${type}s/${slug}` },
  );

  const body = response.ok ? await response.json() : null;

  return {
    body: body as UserPlexStreamResponse,
    status: response.status,
  };
};

export const userPlexStreamQuery = defineQuery({
  key: 'userPlexStream',
  invalidations: [],
  dependencies: (params) => [params.slug, params.type],
  request: userPlexStreamRequest,
  mapper: (response) => ({
    src: response.body.stream_url,
  }),
  schema: UserPlexStreamSchema,
  ttl: time.days(1),
});
