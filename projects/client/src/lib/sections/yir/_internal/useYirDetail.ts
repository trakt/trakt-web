import { useQuery } from '$lib/features/query/useQuery.ts';
import { yirDetailQuery } from '$lib/requests/queries/users/yirDetailQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';
import { withYirIntlOverlay } from './withYirIntlOverlay.ts';

type UseYirDetailProps = {
  slug: string;
  year: number;
};

export function useYirDetail(props: UseYirDetailProps) {
  const query = useQuery(yirDetailQuery(props));

  return withYirIntlOverlay(
    query.pipe(map(($query) => $query.data)),
    query.pipe(map(toLoadingState)),
  );
}
