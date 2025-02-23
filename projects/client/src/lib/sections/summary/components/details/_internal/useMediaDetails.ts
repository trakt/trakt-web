import * as m from '$lib/features/i18n/messages.ts';
import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaStudio } from '$lib/requests/models/MediaStudio.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

import { GenreIntlProvider } from '$lib/components/summary/GenreIntlProvider.ts';
import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import type { CrewMember, Job } from '$lib/requests/models/MediaCrew.ts';
import { toHumanDay } from '$lib/utils/formatting/date/toHumanDay.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';
import { toCountryName } from '$lib/utils/formatting/intl/toCountryName.ts';
import { toLanguageName } from '$lib/utils/formatting/intl/toLanguageName.ts';
import { toTranslatedValue } from '$lib/utils/formatting/string/toTranslatedValue.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { MediaDetailsProps } from '../MediaDetailsProps.ts';

function releaseAndDurationDetails(media: MediaEntry) {
  const airDateOrStatus = () => {
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
  };

  return [
    airDateOrStatus(),
    {
      title: m.runtime(),
      values: [toHumanDuration({ minutes: media.runtime }, languageTag())],
    },
  ];
}

function mainCreditsDetails(type: MediaType, crew: MediaCrew) {
  const toCrewMemberWithJob = (person: CrewMember) => {
    const jobs = person.jobs.map((job) => toTranslatedValue('job', job));
    return {
      label: `${person.name} (${jobs.join(', ')})`,
      link: UrlBuilder.people(person.id),
    };
  };

  const filterOnJob = (crewMembers: CrewMember[], job: Job) => {
    return crewMembers.filter((crewMember) => crewMember.jobs.includes(job));
  };

  const creatorOrDirector = () => {
    switch (type) {
      case 'movie':
        return {
          title: m.director(),
          values: filterOnJob(crew.directors, 'Director')
            .map(toCrewMemberWithJob),
        };
      case 'show':
        return {
          title: m.creator(),
          values: filterOnJob(crew.creators, 'Creator')
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
  const genres = media.genres.map(GenreIntlProvider.genre);
  const studioNames = studios.map((studio) => studio.name);

  const languages = media.languages?.map((language) =>
    toLanguageName(language, languageTag())
  );

  return [
    {
      title: m.country(),
      values: media.country
        ? [toCountryName(media.country, languageTag())]
        : undefined,
    },
    {
      title: m.language(),
      values: languages,
    },
    {
      title: m.studio(),
      values: studioNames,
    },
    {
      title: m.genre(),
      values: genres,
    },
  ];
}

type MediaDetail = {
  title: string;
  values?: Array<string | { label: string; link: string }>;
};

export function useMediaDetails({
  media,
  studios,
  crew,
  type,
}: MediaDetailsProps): MediaDetail[] {
  return [
    ...releaseAndDurationDetails(media),
    ...mainCreditsDetails(type, crew),
    ...metaDetails(media, studios),
  ];
}
