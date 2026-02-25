import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import {
  LimitsSchema,
  type UserLimits,
  UserLimitsSchema,
} from '../../models/UserLimits.ts';

type UserLimitsParams = ApiParams;

export const UserLimitsResponseSchema = z.object({
  history: LimitsSchema,
  ratings: LimitsSchema,
  watchlist_items: LimitsSchema,
  total_list_items: LimitsSchema,
  static_lists: LimitsSchema,
  dynamic_lists: LimitsSchema,
  offline_library: LimitsSchema,
  digital_library: LimitsSchema,
  total_notes: LimitsSchema,
});

type UserLimitsResponse = z.infer<
  typeof UserLimitsResponseSchema
>;

function mapToUserLimits(
  response?: UserLimitsResponse,
): UserLimits | Nil {
  if (!response) {
    return null;
  }

  return {
    history: response.history,
    ratings: response.ratings,
    watchlistItems: response.watchlist_items,
    totalListItems: response.total_list_items,
    staticLists: response.static_lists,
    dynamicLists: response.dynamic_lists,
    offlineLibrary: response.offline_library,
    digitalLibrary: response.digital_library,
    totalNotes: response.total_notes,
  };
}

const userLimitsRequest = async (
  { fetch }: UserLimitsParams,
) => {
  const response = await rawApiFetch(
    { fetch, path: '/v3/users/me/usage' },
  );

  return response.ok
    ? {
      body: UserLimitsResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: undefined, status: 200 };
};

export const userLimitsQuery = defineQuery({
  key: 'userLimits',
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.Listed('movie'),
    InvalidateAction.Listed('show'),
    InvalidateAction.Rated('movie'),
    InvalidateAction.Rated('show'),
    InvalidateAction.Rated('episode'),
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.List.Created,
    InvalidateAction.List.Deleted,
  ],
  dependencies: [],
  request: userLimitsRequest,
  mapper: (response) => mapToUserLimits(response.body),
  schema: UserLimitsSchema.nullish(),
  ttl: time.hours(3),
});
