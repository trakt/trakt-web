import { GenreIntlProvider } from '$lib/components/summary/GenreIntlProvider.ts';
import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import type {
  CrewMember,
  Job,
  MediaCrew,
} from '$lib/requests/models/MediaCrew.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaNetwork } from '$lib/requests/models/MediaNetwork.ts';
import type { MediaStudio } from '$lib/requests/models/MediaStudio.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { isMaxDate } from '$lib/utils/date/isMaxDate.ts';
import { toHumanDay } from '$lib/utils/formatting/date/toHumanDay.ts';
import { toHumanDayTime } from '$lib/utils/formatting/date/toHumanDayTime.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';
import { toCountryName } from '$lib/utils/formatting/intl/toCountryName.ts';
import { toLanguageName } from '$lib/utils/formatting/intl/toLanguageName.ts';
import { toTranslatedStatus } from '$lib/utils/formatting/string/toTranslatedStatus.ts';
import type { MediaDetailsProps } from '../MediaDetailsProps.ts';
import { toCrewMemberWithJob } from './toCrewMemberWithJob.ts';

const ENDED_STATUSES = new Set(['ended', 'canceled']);

function isCurrentlyAiring(show: ShowEntry, now: Date): boolean {
  return !isMaxDate(show.airDate) &&
    show.airDate <= now &&
    !ENDED_STATUSES.has(show.status);
}

function originalTitle(media: MediaEntry) {
  if (!media.originalTitle || media.originalTitle === media.title) {
    return;
  }

  return [media.originalTitle];
}

function mediaAirDate(media: MediaEntry) {
  if (isMaxDate(media.airDate)) {
    return {
      title: m.header_expected_premiere(),
      values: [m.tag_text_tba()],
    };
  }

  const isUpcomingItem = media.airDate > new Date();
  return {
    title: isUpcomingItem ? m.header_expected_premiere() : m.header_premiered(),
    values: [toHumanDay({ date: media.airDate, locale: getLocale() })],
  };
}

function mediaStatus(media: MediaEntry) {
  return {
    title: m.header_status(),
    values: media.year && media.type === 'movie'
      ? undefined
      : [toTranslatedStatus(media.status)],
  };
}

function episodeAirDate(episode: EpisodeEntry) {
  const isUpcomingItem = episode.airDate > new Date();
  const isTba = isMaxDate(episode.airDate);

  return {
    title: isUpcomingItem ? m.header_airs() : m.header_aired(),
    values: [
      isTba ? m.tag_text_tba() : toHumanDay({
        date: episode.airDate,
        locale: getLocale(),
        format: 'long-with-time',
      }),
    ],
  };
}

function runtime(entry: MediaEntry | EpisodeEntry) {
  return {
    title: m.header_runtime(),
    values: [toHumanDuration({ minutes: entry.runtime }, languageTag())],
  };
}

function networks(entries: MediaNetwork[] | undefined) {
  return {
    title: m.header_network(),
    values: entries?.map((network) => network.name),
  };
}

function showAirs(show: ShowEntry, now: Date): MediaDetail {
  if (!show.airs || !isCurrentlyAiring(show, now)) {
    return { title: m.header_airs() };
  }

  const local = toHumanDayTime({ ...show.airs, locale: languageTag() });
  if (!local) {
    return { title: m.header_airs() };
  }

  return {
    title: m.header_airs(),
    values: [m.text_airs_day_time(local)],
  };
}

function totalRuntime(show: ShowEntry): MediaDetail {
  const totalMinutes = show.totalRuntime;

  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
    return { title: m.header_total_runtime() };
  }

  const duration = toHumanDuration({ minutes: totalMinutes }, languageTag());
  const count = show.episode.count;
  const episodes = m.tag_text_number_of_episodes({ count });

  return {
    title: m.header_total_runtime(),
    values: [`${duration} (${episodes})`],
  };
}

function postCredits(entry: MediaEntry | EpisodeEntry) {
  return {
    title: m.header_post_credits(),
    values: entry.postCredits
      .map((scene) => {
        return scene === 'during'
          ? m.text_during_credits()
          : m.text_after_credits();
      }),
  };
}

function mainCredits(type: ExtendedMediaType, crew: MediaCrew) {
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
            .map((director) =>
              toCrewMemberWithJob({
                person: director,
                position: 'directing',
                type,
              })
            ),
        };
      case 'show':
        return {
          title: m.header_creator(),
          values: crew.creators
            .filter((creator) => onJob(creator, 'Creator'))
            .map((creator) =>
              toCrewMemberWithJob({
                person: creator,
                position: 'created by',
                type,
              })
            ),
        };
    }
  };

  return [
    creatorOrDirector(),
    {
      title: m.header_writer(),
      values: crew.writers.map((writer) =>
        toCrewMemberWithJob({
          person: writer,
          position: 'writing',
          type,
        })
      ),
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
      networks(props.networks),
      runtime(props.episode),
      ...mainCredits(props.type, props.crew),
      postCredits(props.episode),
    ];
  }

  const now = new Date();
  const showAirsDetails = props.type === 'show'
    ? [showAirs(props.media, now)]
    : [];
  const totalRuntimeDetails = props.type === 'show'
    ? [totalRuntime(props.media)]
    : [];

  return [
    ...showAirsDetails,
    mediaAirDate(props.media),
    mediaStatus(props.media),
    runtime(props.media),
    ...totalRuntimeDetails,
    networks(props.networks),
    ...mainCredits(props.type, props.crew),
    ...metaDetails(props.media, props.studios),
    postCredits(props.media),
  ];
}
