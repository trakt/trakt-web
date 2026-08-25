import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';
import { drawerNavigation } from '$lib/components/drawer/drawerNavigation.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import {
  GLANCE_EPISODE_PARAM,
  GLANCE_SEASON_PARAM,
  GLANCE_SLUG_PARAM,
  GLANCE_TYPE_PARAM,
} from './constants.ts';
import { MediaGlanceDrawers } from './MediaGlanceDrawers.ts';

const mediaGlanceParams = {
  [MediaGlanceDrawers.Media]: {
    [GLANCE_TYPE_PARAM]: '',
    [GLANCE_SLUG_PARAM]: '',
  },
  [MediaGlanceDrawers.Episode]: {
    [GLANCE_SLUG_PARAM]: '',
    [GLANCE_SEASON_PARAM]: '',
    [GLANCE_EPISODE_PARAM]: '',
  },
  [MediaGlanceDrawers.Season]: {
    [GLANCE_SLUG_PARAM]: '',
    [GLANCE_SEASON_PARAM]: '',
  },
} satisfies Partial<Record<MediaGlanceDrawers, Record<string, string>>>;

function mapToDrawer(value: string | Nil) {
  switch (value) {
    case MediaGlanceDrawers.Media:
      return MediaGlanceDrawers.Media;
    case MediaGlanceDrawers.Episode:
      return MediaGlanceDrawers.Episode;
    case MediaGlanceDrawers.Season:
      return MediaGlanceDrawers.Season;
    default:
      return null;
  }
}

function mapToType(value: string | Nil): MediaType | null {
  switch (value) {
    case 'movie':
      return 'movie';
    case 'show':
      return 'show';
    default:
      return null;
  }
}

function mapToNumber(value: string | Nil) {
  if (value == null) {
    return null;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

export function mediaGlanceNavigation(searchParams?: URLSearchParams) {
  const { buildDrawerLink, close } = drawerNavigation(mediaGlanceParams);

  return {
    drawer: mapToDrawer(searchParams?.get(DRAWER_VIEW_PARAM)),
    type: mapToType(searchParams?.get(GLANCE_TYPE_PARAM)),
    slug: searchParams?.get(GLANCE_SLUG_PARAM) ?? null,
    season: mapToNumber(searchParams?.get(GLANCE_SEASON_PARAM)),
    episode: mapToNumber(searchParams?.get(GLANCE_EPISODE_PARAM)),
    close,
    buildMediaGlanceLink: (
      { type, slug }: { type: MediaType; slug: string },
    ) =>
      buildDrawerLink(MediaGlanceDrawers.Media, {
        [GLANCE_TYPE_PARAM]: type,
        [GLANCE_SLUG_PARAM]: slug,
      }),
    buildEpisodeGlanceLink: (
      { slug, season, episode }: {
        slug: string;
        season: number;
        episode: number;
      },
    ) =>
      buildDrawerLink(MediaGlanceDrawers.Episode, {
        [GLANCE_SLUG_PARAM]: slug,
        [GLANCE_SEASON_PARAM]: String(season),
        [GLANCE_EPISODE_PARAM]: String(episode),
      }),
    buildSeasonGlanceLink: (
      { slug, season }: { slug: string; season: number },
    ) =>
      buildDrawerLink(MediaGlanceDrawers.Season, {
        [GLANCE_SLUG_PARAM]: slug,
        [GLANCE_SEASON_PARAM]: String(season),
      }),
  };
}
