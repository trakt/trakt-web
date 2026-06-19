import { useQuery } from '$lib/features/query/useQuery.ts';
import { mirDetailQuery } from '$lib/requests/queries/users/mirDetailQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';

type UseMirDetailProps = {
  slug: string;
  year: number;
  month: number;
};

export function useMirDetail(props: UseMirDetailProps) {
  const query = useQuery(mirDetailQuery(props));

  return {
    detail: query.pipe(map(($query) => $query.data)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
