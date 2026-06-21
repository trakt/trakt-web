export type StreamingBrand = {
  key: string;
  slugs: ReadonlyArray<string>;
};

// Top-tier brands for the simple view, ordered by global reach. Each brand
// folds its store/channel/ad-supported slug variants so the picker shows one
// logo per brand instead of every variant.
export const STREAMING_BRANDS: ReadonlyArray<StreamingBrand> = [
  {
    key: 'netflix',
    slugs: ['netflix', 'netflix_standard_with_ads', 'netflix_kids'],
  },
  {
    key: 'apple_tv_plus',
    slugs: ['apple_tv_plus', 'apple_tv_plus_amazon_channel'],
  },
  { key: 'disney_plus', slugs: ['disney_plus', 'disneynow'] },
  {
    key: 'amazon_prime_video',
    slugs: [
      'amazon_prime_video',
      'amazon_prime_video_with_ads',
      'amazon_prime_video_free_with_ads',
    ],
  },
  {
    key: 'hbo_max',
    slugs: ['hbo_max', 'hbo_max_amazon_channel', 'max_stream'],
  },
  { key: 'hulu', slugs: ['hulu'] },
  {
    key: 'paramount_plus',
    slugs: [
      'paramount_plus',
      'paramount_plus_amazon_channel',
      'paramount_plus_apple_tv_channel',
      'paramount_plus_premium',
      'paramount_plus_basic_with_ads',
    ],
  },
  { key: 'peacock', slugs: ['peacock', 'peacock_premium_plus'] },
  { key: 'crunchyroll', slugs: ['crunchyroll', 'crunchyroll_amazon_channel'] },
];
