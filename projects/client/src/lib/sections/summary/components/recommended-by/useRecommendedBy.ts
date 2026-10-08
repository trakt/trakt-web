import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaSocialQueryTarget } from '$lib/requests/queries/media/mediaSocialQuery.ts';
import { muteSharerRequest } from '$lib/requests/queries/shares/muteSharerRequest.ts';
import { recommendedByQuery } from '$lib/requests/queries/shares/recommendedByQuery.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { distinctUntilChanged, map, type Observable, switchMap } from 'rxjs';

function toTargetUrl(target: MediaSocialQueryTarget): string {
  switch (target.type) {
    case 'movie':
      return UrlBuilder.movie(target.slug);
    case 'show':
      return UrlBuilder.show(target.slug);
    case 'episode':
      return UrlBuilder.episode(target.slug, target.season, target.episode);
  }
}

export function useRecommendedBy(target$: Observable<MediaSocialQueryTarget>) {
  const recommendedBy = target$.pipe(
    map(toTargetUrl),
    distinctUntilChanged(),
    switchMap((url) => useQuery(recommendedByQuery({ url }))),
    map(($query) => $query.data ?? null),
  );

  const mute = useMutation(defineMutation({
    key: 'share:mute',
    request: (sharerId: number) => muteSharerRequest({ sharerId }),
    invalidations: [InvalidateAction.Share.Mute],
  }));

  return {
    recommendedBy,
    muteSharer: mute.mutate,
    isMuting: mute.isPending,
  };
}
