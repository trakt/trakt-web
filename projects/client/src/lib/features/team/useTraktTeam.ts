import { useQuery } from '$lib/features/query/useQuery.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { traktTeamQuery } from '$lib/requests/queries/team/traktTeamQuery.ts';
import { shuffle } from '$lib/utils/array/shuffle.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, type Observable } from 'rxjs';

type TraktTeam = {
  isLoading: Observable<boolean>;
  team: Observable<Array<UserProfile>>;
};

export function useTraktTeam(
  following: UserProfile[],
  limit?: number,
): TraktTeam {
  const members = useQuery(traktTeamQuery());

  return {
    isLoading: members.pipe(map(toLoadingState)),
    team: members.pipe(
      map(
        ($members) => {
          const team = $members.data ?? [];
          const unfollowedMembers = team.filter((member) =>
            !following.some((user) => user.username === member.username)
          );

          return shuffle(unfollowedMembers)
            .slice(0, limit ?? unfollowedMembers.length);
        },
      ),
    ),
  };
}
