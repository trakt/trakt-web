import { map } from 'rxjs';
import { useQuery } from '../../../features/query/useQuery.ts';
import { userWatchingQuery } from '../../../requests/queries/users/userWatchingQuery.ts';

export function useCurrentUserNowWatching() {
  const response = useQuery(userWatchingQuery({
    slug: 'me',
  }));

  return {
    nowWatching: response.pipe(map(($response) => $response.data ?? null)),
  };
}
