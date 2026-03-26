import { useQuery } from '$lib/features/query/useQuery.ts';
import { showVideosQuery } from '$lib/requests/queries/movies/showVideosQuery.ts';
import { map } from 'rxjs';

export function useShowVideos({ slug }: { slug: string }) {
  const videos = useQuery(showVideosQuery({ slug }));

  return videos.pipe(map(($videos) => $videos.data ?? []));
}
