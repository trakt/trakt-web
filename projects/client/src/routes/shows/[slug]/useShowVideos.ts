import { useQuery } from '$lib/features/query/useQuery.ts';
import { showVideosQuery } from '$lib/requests/queries/movies/showVideosQuery.ts';
import { map, type Observable } from 'rxjs';

export function useShowVideos(input: { slug: Observable<string> }) {
  const videos = useQuery(
    input.slug.pipe(map((slug) => showVideosQuery({ slug }))),
  );

  return videos.pipe(map(($videos) => $videos.data ?? []));
}
