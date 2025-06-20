import * as m from '$lib/features/i18n/messages.ts';
import type { MarkAsWatchedStoreProps } from '../useMarkAsWatched.ts';

export function getWarningMessage(
  title: string,
  target: MarkAsWatchedStoreProps,
): string | null {
  const isShow = target.type === 'show';
  const episodeCount = target.type === 'episode' &&
    Array.isArray(target.media) && target.media.length;
  const isMultipleEpisodes = episodeCount && episodeCount > 1;

  const isDangerousAction = isShow || isMultipleEpisodes;

  if (!isDangerousAction) {
    return null;
  }

  return target.type === 'show'
    ? m.mark_as_watched_show_warning({ title })
    : m.mark_as_watched_multiple_episodes_warning({ count: episodeCount });
}
