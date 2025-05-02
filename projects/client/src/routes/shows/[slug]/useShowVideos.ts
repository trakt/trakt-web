import { useQuery } from '$lib/features/query/useQuery.ts';
import { showVideosQuery } from '$lib/requests/queries/movies/showVideosQuery.ts';
import { derived } from 'svelte/store';

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

  return derived(videos, ($videos) => $videos.data ?? []);
}
