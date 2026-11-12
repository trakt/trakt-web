import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { NudgeSchema } from '$lib/requests/models/Nudge.ts';
import { NudgeResponseSchema } from '$lib/requests/models/NudgeResponse.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToNudge } from './_internal/mapToNudge.ts';

const nudgeRequest = async ({ fetch }: ApiParams) => {
  const response = await rawApiFetch({ fetch, path: '/v3/users/me/nudge' });

  if (!response.ok) {
    throw new Error(`Failed to load nudge: ${response.status}`);
  }

  return {
    body: NudgeResponseSchema.parse(await response.json()),
    status: 200,
  };
};

export const nudgeQuery = defineQuery({
  key: 'nudge',
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.Listed('movie'),
    InvalidateAction.Listed('show'),
    InvalidateAction.List.Created,
    InvalidateAction.List.Deleted,
    InvalidateAction.Note.Add('movie'),
    InvalidateAction.Note.Add('show'),
    InvalidateAction.Note.Delete('movie'),
    InvalidateAction.Note.Delete('show'),
  ],
  dependencies: [],
  request: nudgeRequest,
  mapper: (response) => mapToNudge(response.body),
  schema: NudgeSchema.nullable(),
  ttl: time.minutes(30),
});
