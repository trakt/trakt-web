import type { MarkAsWatchedStoreProps } from '../../useMarkAsWatched.ts';
import type { WatchStateShow } from './WatchStateShow.ts';

function toColors(media: object): [string, string] | undefined {
  if (!('colors' in media)) return;
  if (!Array.isArray(media.colors)) return;

  const [first, second] = media.colors;
  if (typeof first !== 'string' || typeof second !== 'string') return;

  return [first, second];
}

export function toWatchStateShow(
  target: MarkAsWatchedStoreProps,
): WatchStateShow | null {
  if (target.type !== 'show') return null;
  if (Array.isArray(target.media)) return null;

  const { id, episode } = target.media;
  const slug = 'slug' in target.media ? target.media.slug : null;

  if (typeof slug !== 'string') return null;
  if (!episode) return null;

  return { id, slug, episode, colors: toColors(target.media) };
}
