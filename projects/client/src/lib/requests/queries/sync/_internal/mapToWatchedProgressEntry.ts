import { mapToPoster } from '$lib/requests/_internal/mapToPoster.ts';
import { mediumUrl } from '$lib/requests/_internal/mediumUrl.ts';
import { thumbUrl } from '$lib/requests/_internal/thumbUrl.ts';
import {
  MEDIA_COVER_LARGE_PLACEHOLDER,
  MEDIA_COVER_THUMB_PLACEHOLDER,
} from '$lib/utils/assets.ts';
import type { WatchedProgressEntry } from '$lib/requests/models/WatchedProgressEntry.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';

type RawEpisode = {
  number: number;
  completed: boolean;
  last_watched_at: string | null;
};

type RawSeason = {
  number: number;
  title: string | null;
  aired: number;
  completed: number;
  episodes: RawEpisode[];
};

type RawNextEpisode = {
  season: number;
  number: number;
  title: string;
  ids: {
    trakt: number;
    tvdb: number | null;
    imdb: string | null;
    tmdb: number | null;
    tvrage: number | null;
  };
  images?: {
    screenshot?: string[];
  };
};

export type WatchedProgressRawItem = {
  show: {
    title: string;
    year: number | null;
    status?: string;
    ids: {
      trakt: number;
      slug: string;
      tvdb: number | null;
      imdb: string | null;
      tmdb: number | null;
      tvrage: number | null;
    };
    aired_episodes: number;
    images?: {
      poster?: string[];
      fanart?: string[];
    };
  };
  progress: {
    aired: number;
    completed: number;
    plays?: number;
    last_watched_at: string | null;
    reset_at: string | null;
    seasons: RawSeason[];
    next_episode: RawNextEpisode | null;
    last_episode: RawNextEpisode | null;
  };
};

function mapEpisodeScreenshot(
  images?: { screenshot?: string[] },
): string | null {
  const candidate = findDefined(...(images?.screenshot ?? []));
  return prependHttps(thumbUrl(candidate)) ?? null;
}

function mapRawNextEpisode(raw: RawNextEpisode | null) {
  if (!raw) return null;

  return {
    season: raw.season,
    number: raw.number,
    title: raw.title,
    id: raw.ids.trakt,
    screenshot: mapEpisodeScreenshot(raw.images),
  };
}

export function mapToWatchedProgressEntry(
  raw: WatchedProgressRawItem,
): WatchedProgressEntry {
  const { show, progress } = raw;
  const aired = progress.aired;
  const completed = progress.completed;
  const poster = mapToPoster(show.images);
  const fanartCandidate = findDefined(...(show.images?.fanart ?? []));
  const fanart = {
    medium: prependHttps(mediumUrl(fanartCandidate), MEDIA_COVER_LARGE_PLACEHOLDER),
    thumb: prependHttps(thumbUrl(fanartCandidate), MEDIA_COVER_THUMB_PLACEHOLDER),
  };

  return {
    key: `show-${show.ids.trakt}`,
    show: {
      title: show.title,
      year: show.year,
      slug: show.ids.slug,
      id: show.ids.trakt,
      airedEpisodes: show.aired_episodes,
      status: show.status ?? 'unknown',
      poster: poster.url,
      fanart,
    },
    aired,
    completed,
    plays: progress.plays ?? null,
    percentage: aired > 0 ? Math.round((completed / aired) * 100) : 0,
    lastWatchedAt: progress.last_watched_at
      ? new Date(progress.last_watched_at)
      : null,
    resetAt: progress.reset_at ? new Date(progress.reset_at) : null,
    seasons: progress.seasons.map((season) => ({
      number: season.number,
      title: season.title,
      aired: season.aired,
      completed: season.completed,
      episodes: season.episodes.map((episode) => ({
        number: episode.number,
        completed: episode.completed,
        lastWatchedAt: episode.last_watched_at
          ? new Date(episode.last_watched_at)
          : null,
      })),
    })),
    nextEpisode: mapRawNextEpisode(progress.next_episode),
    lastEpisode: mapRawNextEpisode(progress.last_episode),
  };
}
