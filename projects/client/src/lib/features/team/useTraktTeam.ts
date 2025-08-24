import { useQuery } from '$lib/features/query/useQuery.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { userProfileQuery } from '$lib/requests/queries/users/userProfileQuery.ts';
import { shuffle } from '$lib/utils/array/shuffle.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived, type Readable } from 'svelte/store';

// FIXME: move this to the server to have a single source of truth
const TEAM_SLUGS = [
  'andrei-l-magnea',
  'justin',
  'kcador',
  'kristin',
  'marius',
  'mike-d-47b75e85-263f-4f74-bda4-d6347793fbba',
  'ohifriend',
  'sean',
  'seftur',
  'sonply',
  'visualcortex',
  'zandertrakt',
];

type TraktTeam = {
  isLoading: Readable<boolean>;
  team: Readable<Array<UserProfile>>;
};

export function useTraktTeam(
  following: UserProfile[],
  limit?: number,
): TraktTeam {
  const unfollowedMembers = TEAM_SLUGS.filter(
    (slug) => !following.some((user) => user.username === slug),
  );

  const queries = shuffle(unfollowedMembers)
    .slice(0, limit ?? unfollowedMembers.length)
    .map((slug) => userProfileQuery({ slug }))
    .map((query) => useQuery(query));

  const isLoading = derived(
    queries,
    ($queries) => $queries.some(toLoadingState),
  );

  return {
    isLoading,
    team: derived(
      queries,
      ($queries) =>
        $queries
          .filter((query) => Boolean(query.data))
          .map((query) => assertDefined(query.data)),
    ),
  };
}
