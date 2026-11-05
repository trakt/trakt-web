import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { matchQuery } from '$lib/requests/queries/media/matchQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { combineLatest, map, type Observable } from 'rxjs';

type MatchTarget = {
  type: MediaType;
  id: number;
  enabled?: boolean;
};

export function useMatch(target$: Observable<MatchTarget>) {
  const { isAuthorized } = useAuth();
  const { user } = useUser();

  const query = useQuery(
    combineLatest([target$, isAuthorized]).pipe(
      map(([current, authorized]) =>
        matchQuery({
          type: current.type,
          id: current.id,
          enabled: authorized && current.enabled !== false,
        }),
      ),
    ),
  );

  const isAvailable = combineLatest([target$, isAuthorized, user]).pipe(
    map(
      ([current, authorized, $user]) =>
        authorized &&
        current.enabled !== false &&
        Boolean($user?.isVip || $user?.isDirector),
    ),
  );

  return {
    match: combineLatest([query, isAuthorized]).pipe(
      map(([state, authorized]) =>
        authorized ? (state.data?.score ?? null) : null,
      ),
    ),
    taste: combineLatest([query, isAuthorized]).pipe(
      map(([state, authorized]) =>
        authorized ? (state.data?.taste ?? []) : [],
      ),
    ),
    isLoading: query.pipe(map(toLoadingState)),
    isAvailable,
  };
}
