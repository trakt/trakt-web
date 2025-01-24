import type { ManifestOptions } from 'vite-plugin-pwa';

export const manifest: ManifestOptions = {
  id: 'trakt-lite-pwa',
  name: 'Trakt Lite',
  short_name: 'Trakt',
  description: 'A lightweight Trakt.tv client',
  dir: 'ltr',
  lang: 'en',
  prefer_related_applications: false,
  related_applications: [
    {
      platform: 'play',
      url: 'https://play.google.com/store/apps/details?id=tv.trakt.trakt',
      id: 'tv.trakt.trakt',
    },
  ],
  scope: '/',
  scope_extensions: [
    {
      origin: 'https://app.trakt.tv',
    },
  ],
  launch_handler: {
    client_mode: ['navigate-existing', 'auto'],
  },
  icons: [
    {
      src: 'pwa/android/icon_monochrome.svg',
      type: 'image/svg+xml',
      sizes: 'any',
      purpose: 'monochrome',
    },
    {
      src: 'pwa/android/icon_maskable.svg',
      type: 'image/svg+xml',
      sizes: 'any',
      purpose: 'maskable',
    },
    {
      src: 'pwa/android/icon_192.png',
      type: 'image/png',
      sizes: '192x192',
    },
    {
      src: 'pwa/android/icon_512.png',
      type: 'image/png',
      sizes: '512x512',
    },
  ],
  start_url: '/',
  display: 'standalone',
  theme_color: '#131517',
  background_color: '#131517',
  orientation: 'any',
  categories: ['entertainment'],
  shortcuts: [
    {
      name: 'Shows',
      short_name: 'Shows',
      description: 'Browse TV Shows',
      url: '/shows',
      icons: [
        {
          src: 'pwa/shortcuts/shows.png',
          sizes: '96x96',
          type: 'image/png',
        },
      ],
    },
    {
      name: 'Movies',
      short_name: 'Movies',
      description: 'Browse Movies',
      url: '/movies',
      icons: [
        {
          src: 'pwa/shortcuts/movies.png',
          sizes: '96x96',
          type: 'image/png',
        },
      ],
    },
    {
      name: 'Profile',
      short_name: 'Profile',
      description: 'View Profile',
      url: '/profile/me',
      icons: [
        {
          src: 'pwa/shortcuts/profile.png',
          sizes: '96x96',
          type: 'image/png',
        },
      ],
    },
  ],
  screenshots: [
    {
      type: 'image/webp',
      src: 'pwa/screenshots/1_welcome.webp',
      sizes: '778x1738',
    },
    {
      type: 'image/webp',
      src: 'pwa/screenshots/2_shows.webp',
      sizes: '778x1738',
    },
    {
      type: 'image/webp',
      src: 'pwa/screenshots/3_show.webp',
      sizes: '778x1738',
    },
    {
      type: 'image/webp',
      src: 'pwa/screenshots/4_movies.webp',
      sizes: '778x1738',
    },
    {
      type: 'image/webp',
      src: 'pwa/screenshots/5_movie.webp',
      sizes: '778x1738',
    },
    {
      type: 'image/webp',
      src: 'pwa/screenshots/1_wide_welcome.webp',
      form_factor: 'wide',
      sizes: '1298x902',
    },
    {
      type: 'image/webp',
      src: 'pwa/screenshots/2_wide_shows.webp',
      form_factor: 'wide',
      sizes: '1298x902',
    },
    {
      type: 'image/webp',
      src: 'pwa/screenshots/3_wide_show.webp',
      form_factor: 'wide',
      sizes: '1298x902',
    },
    {
      type: 'image/webp',
      src: 'pwa/screenshots/4_wide_movies.webp',
      form_factor: 'wide',
      sizes: '1298x902',
    },
    {
      type: 'image/webp',
      src: 'pwa/screenshots/5_wide_movie.webp',
      form_factor: 'wide',
      sizes: '1298x902',
    },
  ],
  file_handlers: [],
  display_override: [],
  publicPath: '',
  protocol_handlers: [],
  iarc_rating_id: '',
  share_target: {
    action: '',
    method: undefined,
    enctype: undefined,
    params: {
      title: undefined,
      text: undefined,
      url: undefined,
      files: undefined,
    },
  },
};
