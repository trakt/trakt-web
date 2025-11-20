import * as m from '$lib/features/i18n/messages.ts';
import type { MarkAsWatchedStoreProps } from '../useMarkAsWatched.ts';

export function toMarkAsWatchedMetaInfo(props: MarkAsWatchedStoreProps) {
  if (Array.isArray(props.media)) {
    switch (props.type) {
      case 'episode': {
        const episodeCount = props.media.length;
        return m.tag_text_number_of_episodes({ count: episodeCount });
      }
      default:
        return;
    }
  }

  switch (props.type) {
    case 'episode':
      return `${props.show.title} • ${
        m.text_season_episode_number(props.media)
      }`;
    case 'show': {
      if (!props.media.seasons) {
        return;
      }

      const episodeCount = props.media.seasons.reduce(
        (acc, season) => acc + season.episodes.length,
        0,
      );
      return m.tag_text_number_of_episodes({ count: episodeCount });
    }
    default:
      return;
  }
}
