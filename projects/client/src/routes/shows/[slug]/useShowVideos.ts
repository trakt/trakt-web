import { useQuery } from '$lib/features/query/useQuery.ts';
import { showVideosQuery } from '$lib/requests/queries/movies/showVideosQuery.ts';
import { map } from 'rxjs';

export function useShowVideos({
  slug,
  seasons,
}: {
  slug: string;
  seasons: number[];
}) {
  const videos = useQuery(showVideosQuery({
    slug,
    seasons,
  }));

  return videos.pipe(map(($videos) => $videos.data ?? []));
}
