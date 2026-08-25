import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';
import { drawerNavigation } from '$lib/components/drawer/drawerNavigation.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { GLANCE_SLUG_PARAM, GLANCE_TYPE_PARAM } from './constants.ts';
import { MediaGlanceDrawers } from './MediaGlanceDrawers.ts';

const mediaGlanceParams = {
  [MediaGlanceDrawers.Media]: {
    [GLANCE_TYPE_PARAM]: '',
    [GLANCE_SLUG_PARAM]: '',
  },
} satisfies Partial<Record<MediaGlanceDrawers, Record<string, string>>>;

function mapToDrawer(value: string | Nil) {
  switch (value) {
    case MediaGlanceDrawers.Media:
      return MediaGlanceDrawers.Media;
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

export function mediaGlanceNavigation(searchParams?: URLSearchParams) {
  const { buildDrawerLink, close } = drawerNavigation(mediaGlanceParams);

  return {
    drawer: mapToDrawer(searchParams?.get(DRAWER_VIEW_PARAM)),
    type: mapToType(searchParams?.get(GLANCE_TYPE_PARAM)),
    slug: searchParams?.get(GLANCE_SLUG_PARAM) ?? null,
    close,
    buildMediaGlanceLink: (
      { type, slug }: { type: MediaType; slug: string },
    ) =>
      buildDrawerLink(MediaGlanceDrawers.Media, {
        [GLANCE_TYPE_PARAM]: type,
        [GLANCE_SLUG_PARAM]: slug,
      }),
  };
}
