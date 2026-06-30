import { useQuery } from '$lib/features/query/useQuery.ts';
import { mirDetailQuery } from '$lib/requests/queries/users/mirDetailQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';
import { withYirIntlOverlay } from './withYirIntlOverlay.ts';

type UseMirDetailProps = {
  slug: string;
  year: number;
  month: number;
};

export function useMirDetail(props: UseMirDetailProps) {
  const query = useQuery(mirDetailQuery(props));

  return withYirIntlOverlay(
    query.pipe(map(($query) => $query.data)),
    query.pipe(map(toLoadingState)),
  );
}
