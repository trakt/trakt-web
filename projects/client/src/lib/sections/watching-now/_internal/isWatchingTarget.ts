import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import type { MediaSocialQueryTarget } from '$lib/requests/queries/media/mediaSocialQuery.ts';

type WatchingTargetParams = {
  nowPlaying: NowPlayingItem;
  target: MediaSocialQueryTarget;
};

export function isWatchingTarget({
  nowPlaying,
  target,
}: WatchingTargetParams): boolean {
  switch (target.type) {
    case 'movie':
      return (
        nowPlaying.type === 'movie' && nowPlaying.media.slug === target.slug
      );
    case 'show':
      return (
        nowPlaying.type === 'episode' && nowPlaying.show.slug === target.slug
      );
    case 'episode':
      return (
        nowPlaying.type === 'episode' &&
        nowPlaying.show.slug === target.slug &&
        nowPlaying.media.season === target.season &&
        nowPlaying.media.number === target.episode
      );
  }
}
