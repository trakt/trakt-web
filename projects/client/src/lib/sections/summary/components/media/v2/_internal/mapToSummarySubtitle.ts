import * as m from '$lib/features/i18n/messages.ts';
import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre.ts';
import { languageTag } from '../../../../../../features/i18n/index.ts';
import { toHumanDuration } from '../../../../../../utils/formatting/date/toHumanDuration.ts';
import type { MediaSummaryEntry } from '../models/MediaSummaryEntry.ts';
import type { EpisodeSummaryEntry } from './SummaryTitleProps.ts';

type MapToSubtitleProps = EpisodeSummaryEntry | MediaSummaryEntry;

const SEPARATOR = '•';

function mapToDuration(props: MapToSubtitleProps) {
  switch (props.type) {
    case 'movie':
      return toHumanDuration(
        { minutes: props.media.runtime },
        languageTag(),
      );
    case 'episode':
      return toHumanDuration(
        { minutes: props.episode.runtime },
        languageTag(),
      );
    default:
      return;
  }
}

function mapToEpisodeCount(props: MapToSubtitleProps) {
  if (props.type !== 'show') {
    return;
  }

  return m.tag_text_number_of_episodes({
    count: props.media.episode.count,
  });
}

function mapToGenre(props: MapToSubtitleProps) {
  const genre = props.media.genres.at(0);
  return genre ? toTranslatedGenre(genre) : null;
}

function mapToYear(props: MapToSubtitleProps) {
  return props.type === 'episode' ? props.episode.year : props.media.year;
}

export function mapToSummarySubtitle(props: MapToSubtitleProps) {
  const genre = mapToGenre(props);
  const duration = mapToDuration(props);
  const episodeCount = mapToEpisodeCount(props);
  const year = mapToYear(props);

  return [
    year,
    duration,
    episodeCount,
    props.media.certification,
    genre,
  ]
    .filter(Boolean)
    .join(` ${SEPARATOR} `);
}
