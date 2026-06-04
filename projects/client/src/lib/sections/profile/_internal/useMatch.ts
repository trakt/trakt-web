import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { userMatchQuery } from '$lib/requests/queries/users/userMatchQuery.ts';
import { map } from 'rxjs';

type UseMatchProps = {
  slug: string;
  mode: DiscoverMode;
};

type MatchBand = 'high' | 'mid' | 'low';

function toMatchBand(score: number): MatchBand {
  if (score >= 70) return 'high';
  if (score >= 40) return 'mid';
  return 'low';
}

export function useMatch({ slug, mode }: UseMatchProps) {
  const query = useQuery(userMatchQuery({ slug, mode }));

  return {
    match: query.pipe(map(($query) => $query.data)),
    isLoading: query.pipe(map(($query) => $query.isLoading)),
    band: query.pipe(map(($query) => toMatchBand($query.data?.score ?? 0))),
  };
}
