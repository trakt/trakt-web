import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { OfficialApp } from './OfficialApp.ts';

export const officialAppCatalog: ReadonlyArray<OfficialApp> = [
  {
    name: 'Trakt',
    iconUrl: '/images/apps/official/trakt-android.webp',
    destinations: [{
      store: 'google-play',
      href: 'https://play.google.com/store/apps/details?id=tv.trakt.trakt',
    }],
  },
  {
    name: 'Trakt',
    iconUrl: '/images/apps/official/trakt-apple.webp',
    destinations: [{
      store: 'app-store',
      href: 'https://apps.apple.com/app/id1514873602',
    }],
  },
  {
    name: 'Trakt Time',
    iconUrl: '/images/apps/official/trakt-time.webp',
    destinations: [{
      store: 'web',
      href: UrlBuilder.app.tvTime(),
    }],
  },
  {
    name: 'Showly',
    iconUrl: '/images/apps/official/showly.webp',
    destinations: [
      {
        store: 'app-store',
        href: 'https://apps.apple.com/app/id6739016219',
      },
      {
        store: 'google-play',
        href:
          'https://play.google.com/store/apps/details?id=com.michaldrabik.showly2',
      },
    ],
  },
  {
    name: 'Watcht',
    iconUrl: '/images/apps/official/watcht.webp',
    destinations: [{
      store: 'app-store',
      href: 'https://apps.apple.com/app/id1396920723',
    }],
  },
  {
    name: 'Rippple',
    iconUrl: '/images/apps/official/rippple.webp',
    destinations: [{
      store: 'app-store',
      href: 'https://apps.apple.com/app/id6758765611',
    }],
  },
];
