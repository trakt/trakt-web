import type { MirShareData } from '$lib/features/share/models/MirShareData.ts';
import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import { isHttpUrl } from '$lib/utils/url/isHttpUrl.ts';
import { resolvePosterSource } from '../../_internal/resolvePosterSource.ts';

type WithImageFallbacksProps = {
  data: MirShareData;
  loaded: ReadonlySet<string>;
};

export function withImageFallbacks({
  data,
  loaded,
}: WithImageFallbacksProps): MirShareData {
  const isUsable = (url: string) => !isHttpUrl(url) || loaded.has(url);
  const toPoster = (url: string) =>
    isUsable(url) ? url : resolvePosterSource(MEDIA_POSTER_PLACEHOLDER);
  const withPoster = <T extends { posterUrl: string }>(item: T): T => ({
    ...item,
    posterUrl: toPoster(item.posterUrl),
  });

  const avatarUrl = data.user.avatarUrl;

  return {
    ...data,
    user: {
      ...data.user,
      avatarUrl:
        avatarUrl && isHttpUrl(avatarUrl) && loaded.has(avatarUrl)
          ? avatarUrl
          : null,
    },
    firstWatched: data.firstWatched && withPoster(data.firstWatched),
    lastWatched: data.lastWatched && withPoster(data.lastWatched),
    shows: data.shows.map(withPoster),
    movies: data.movies.map(withPoster),
  };
}
