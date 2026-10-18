import { rethrowUnlessCancelled } from '$lib/features/query/rethrowUnlessCancelled.ts';
import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
import { mediaPopularQuery } from '$lib/requests/queries/media/mediaPopularQuery.ts';
import { DEFAULT_DRILL_SIZE } from '$lib/utils/constants.ts';
import { firstValueFrom, map } from 'rxjs';
import { toGameTitles } from './toGameTitles.ts';

export function useTitlePool() {
  const query = useInfiniteQuery(
    mediaPopularQuery({ limit: DEFAULT_DRILL_SIZE }),
  );

  const titles = query.pipe(
    map(($query) =>
      toGameTitles($query.data?.pages.flatMap((page) => page.entries) ?? []),
    ),
  );

  const isError = query.pipe(map(($query) => $query.isError));

  const retry = async () => {
    const { refetch } = await firstValueFrom(query);
    await refetch().catch(rethrowUnlessCancelled);
  };

  return { titles, isError, retry };
}
