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

function originalTitle(media: MediaEntry) {
  if (!media.originalTitle || media.originalTitle === media.title) {
    return;
  }

  return [media.originalTitle];
}

function mediaAirDate(media: MediaEntry) {
  const isUpcomingItem = media.airDate > new Date();
  return {
    title: isUpcomingItem ? m.header_expected_premiere() : m.header_premiered(),
    values: [toHumanDay(media.airDate, getLocale())],
  };
}

function mediaStatus(media: MediaEntry) {
  return {
    title: m.header_status(),
    values: media.year && media.type === 'movie'
      ? undefined
      : [toTranslatedValue('status', media.status)],
  };
}

function episodeAirDate(episode: EpisodeEntry) {
  const isUpcomingItem = episode.airDate > new Date();
  return {
    title: isUpcomingItem ? m.header_airs() : m.header_aired(),
    values: [toHumanDay(episode.airDate, getLocale())],
  };
}

function runtime(entry: MediaEntry | EpisodeEntry) {
  return {
    title: m.header_runtime(),
    values: [toHumanDuration({ minutes: entry.runtime }, languageTag())],
  };
}

function creditCookies(entry: MediaEntry | EpisodeEntry) {
  return {
    title: m.header_credit_cookies(),
    values: entry.creditCookies
      .map((scene) => {
        return scene === 'during'
          ? m.text_during_credits()
          : m.text_after_credits();
      }),
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
          title: m.header_director(),
          values: crew.directors
            .filter((director) => onJob(director, 'Director'))
            .map(toCrewMemberWithJob),
        };
      case 'show':
        return {
          title: m.header_creator(),
          values: crew.creators
            .filter((creator) => onJob(creator, 'Creator'))
            .map(toCrewMemberWithJob),
        };
    }
  };

  return [
    creatorOrDirector(),
    {
      title: m.header_writer(),
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
      title: m.header_country(),
      values: media.country
        ? [toCountryName(media.country, languageTag())]
        : undefined,
    },
    {
      title: m.header_language(),
      values: media.languages?.map((language) =>
        toLanguageName(language, languageTag())
      ),
    },
    {
      title: m.header_original_title(),
      values: originalTitle(media),
    },
    {
      title: m.header_studio(),
      values: studios.map((studio) => studio.name),
    },
    {
      title: m.header_genre(),
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
      creditCookies(props.episode),
    ];
  }

  return [
    mediaAirDate(props.media),
    mediaStatus(props.media),
    runtime(props.media),
    ...mainCredits(props.type, props.crew),
    ...metaDetails(props.media, props.studios),
    creditCookies(props.media),
  ];
}
