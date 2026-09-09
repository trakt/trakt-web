import * as m from '$lib/features/i18n/messages.ts';
import { episodeMetaInfo } from '$lib/utils/intl/episodeMetaInfo.ts';
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
      return episodeMetaInfo(props.media, props.show.title);
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
