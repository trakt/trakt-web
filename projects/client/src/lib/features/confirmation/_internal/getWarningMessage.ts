import * as m from '$lib/features/i18n/messages.ts';
import type { MarkAsWatchedStoreProps } from '$lib/sections/media-actions/mark-as-watched/useMarkAsWatched.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';

function getShowWarningMessage(
  title: string,
  target: MarkAsWatchedStoreProps,
): string | null {
  if (target.type !== 'show') {
    return null;
  }

  if (
    !Array.isArray(target.media) &&
    target.media.seasons &&
    target.media.seasons.length > 0
  ) {
    const episodeCount = target.media.seasons.reduce(
      (count, season) => count + season.episodes.length,
      0,
    );
    const lastSeason = assertDefined(target.media.seasons.at(-1));
    const lastEpisode = assertDefined(lastSeason.episodes.at(-1));

    return m.warning_prompt_mark_as_watched_show_until({
      title,
      episode: `${lastSeason.number}x${lastEpisode.number}`,
      count: episodeCount,
    });
  }

  return m.warning_prompt_mark_as_watched_show({ title });
}

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

  return target.type === 'episode'
    ? m.warning_prompt_mark_as_watched_multiple_episodes({
      count: episodeCount,
    })
    : getShowWarningMessage(title, target);
}
