type WellKnownServices = {
  [key: string]: string[];
};

export const WELL_KNOWN_SERVICES: WellKnownServices = {
  amazon: [
    'amazon_video',
    'amazon_prime',
    'amazon_prime_video',
    'amazon_prime_video_with_ads',
  ],
  crunchyroll: ['crunchyroll'],
  disneyPlus: ['disney_plus'],
  googlePlayMovies: ['google_play_movies'],
  hulu: ['hulu'],
  netflix: ['netflix'],
  paramountPlus: ['paramount_plus'],
  peacock: ['peacock'],
  plex: ['plex'],
  rakutenTv: ['rakuten_tv'],
  youtube: ['youtube'],
} as const;
