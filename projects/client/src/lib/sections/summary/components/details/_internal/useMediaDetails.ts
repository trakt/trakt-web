import { GenreIntlProvider } from '$lib/components/summary/GenreIntlProvider.ts';
import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type {
  CrewMember,
  Job,
  MediaCrew,
} from '$lib/requests/models/MediaCrew.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaStudio } from '$lib/requests/models/MediaStudio.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { toHumanDay } from '$lib/utils/formatting/date/toHumanDay.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';
import { toCountryName } from '$lib/utils/formatting/intl/toCountryName.ts';
import { toLanguageName } from '$lib/utils/formatting/intl/toLanguageName.ts';
import { toTranslatedValue } from '$lib/utils/formatting/string/toTranslatedValue.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { MediaDetailsProps } from '../MediaDetailsProps.ts';

function mediaAirDateOrStatus(media: MediaEntry) {
  if (media.year) {
    const isUpcomingItem = media.airDate > new Date();
    return {
      title: isUpcomingItem ? m.expected_premiere() : m.premiered(),
      values: [toHumanDay(media.airDate, getLocale())],
    };
  }

  return {
    title: m.status(),
    values: [toTranslatedValue('status', media.status)],
  };
}

function episodeAirDate(episode: EpisodeEntry) {
  const isUpcomingItem = episode.airDate > new Date();
  return {
    title: isUpcomingItem ? m.airs() : m.aired(),
    values: [toHumanDay(episode.airDate, getLocale())],
  };
}

function runtime(entry: MediaEntry | EpisodeEntry) {
  return {
    title: m.runtime(),
    values: [toHumanDuration({ minutes: entry.runtime }, languageTag())],
  };
}

function mainCredits(type: MediaType | 'episode', crew: MediaCrew) {
  const toCrewMemberWithJob = (person: CrewMember) => {
    const jobs = person.jobs.map((job) => toTranslatedValue('job', job));
    return {
      label: `${person.name} (${jobs.join(', ')})`,
      link: UrlBuilder.people(person.id),
    };
  };

  const onJob = (crewMember: CrewMember, job: Job) =>
    crewMember.jobs.includes(job);

  const creatorOrDirector = () => {
    switch (type) {
      case 'movie':
      case 'episode':
        return {
          title: m.director(),
          values: crew.directors
            .filter((director) => onJob(director, 'Director'))
            .map(toCrewMemberWithJob),
        };
      case 'show':
        return {
          title: m.creator(),
          values: crew.creators
            .filter((creator) => onJob(creator, 'Creator'))
            .map(toCrewMemberWithJob),
        };
    }
  };

  return [
    creatorOrDirector(),
    {
      title: m.writer(),
      values: crew.writers.map(toCrewMemberWithJob),
    },
  ];
}

function metaDetails(
  media: MediaEntry,
  studios: MediaStudio[],
) {
  return [
    {
      title: m.country(),
      values: media.country
        ? [toCountryName(media.country, languageTag())]
        : undefined,
    },
    {
      title: m.language(),
      values: media.languages?.map((language) =>
        toLanguageName(language, languageTag())
      ),
    },
    {
      title: m.studio(),
      values: studios.map((studio) => studio.name),
    },
    {
      title: m.genre(),
      values: media.genres.map(GenreIntlProvider.genre),
    },
  ];
}

type MediaDetail = {
  title: string;
  values?: Array<string | { label: string; link: string }>;
};

export function useMediaDetails(props: MediaDetailsProps): MediaDetail[] {
  if (props.type === 'episode') {
    return [
      episodeAirDate(props.episode),
      runtime(props.episode),
      ...mainCredits(props.type, props.crew),
    ];
  }

  return [
    mediaAirDateOrStatus(props.media),
    runtime(props.media),
    ...mainCredits(props.type, props.crew),
    ...metaDetails(props.media, props.studios),
  ];
}
