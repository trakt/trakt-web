import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import { episodeNumberLabel } from '$lib/utils/intl/episodeNumberLabel.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

type WatchingTitles = {
  title: string;
  subtitle: string | null;
  href: string;
};

export function toWatchingTitles(nowPlaying: NowPlayingItem): WatchingTitles {
  if (nowPlaying.type === 'movie') {
    return {
      title: nowPlaying.media.title,
      subtitle: null,
      href: UrlBuilder.movie(nowPlaying.media.slug),
    };
  }

  const { media: episode, show } = nowPlaying;
  const number = episodeNumberLabel({
    seasonNumber: episode.season,
    episodeNumber: episode.number,
  });

  return {
    title: show.title,
    subtitle: episode.title ? `${number} · ${episode.title}` : number,
    href: UrlBuilder.episodeDrawer(show.slug, episode.season, episode.number),
  };
}
