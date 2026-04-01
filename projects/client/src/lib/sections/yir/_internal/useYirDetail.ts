import { useQuery } from '$lib/features/query/useQuery.ts';
import { yirDetailQuery } from '$lib/requests/queries/users/yirDetailQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';

type UseYirDetailProps = {
  slug: string;
  year: number;
};

export function useYirDetail(props: UseYirDetailProps) {
  const query = useQuery(yirDetailQuery(props));

  return {
    detail: query.pipe(map(($query) => $query.data)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
