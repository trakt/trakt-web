import { useQuery } from '$lib/features/query/useQuery.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { traktTeamQuery } from '$lib/requests/queries/team/traktTeamQuery.ts';
import { shuffle } from '$lib/utils/array/shuffle.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  type Observable,
} from 'rxjs';

type TraktTeam = {
  isLoading: Observable<boolean>;
  team: Observable<Array<UserProfile>>;
};

export function useTraktTeam(
  following: Observable<UserProfile[]>,
  limit?: number,
): TraktTeam {
  const members = useQuery(traktTeamQuery());

  return {
    isLoading: members.pipe(map(toLoadingState)),
    team: combineLatest([
      members.pipe(
        map(($members) => $members.data),
        distinctUntilChanged(),
      ),
      following.pipe(distinctUntilChanged()),
    ]).pipe(
      map(([data, $following]) => {
        const team = data ?? [];
        const unfollowedMembers = team.filter((member) =>
          !$following.some((user) => user.username === member.username)
        );

        return shuffle(unfollowedMembers)
          .slice(0, limit ?? unfollowedMembers.length);
      }),
    ),
  };
}
