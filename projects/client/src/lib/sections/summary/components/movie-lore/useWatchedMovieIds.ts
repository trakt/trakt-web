import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { map } from 'rxjs';

export function useWatchedMovieIds() {
  const { history } = useUser();

  return history.pipe(
    map(($history): ReadonlySet<number> => new Set($history?.movies.keys())),
  );
}
