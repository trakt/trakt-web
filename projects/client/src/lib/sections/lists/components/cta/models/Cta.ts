import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type CtaType =
  | 'up-next'
  | 'released'
  | 'activity'
  | 'upcoming'
  | 'personal-activity'
  | 'watchlist'
  | 'favorites'
  | 'social';

type CtaMap = {
  [K in CtaType]: K extends 'watchlist' | 'favorites'
    ? { type: K; mediaType?: MediaType }
    : { type: K };
};

export type Cta = CtaMap[CtaType];

export type MediaCta = Exclude<Cta, { type: 'activity' } | { type: 'social' }>;
export type SocialCta = Extract<Cta, { type: 'activity' } | { type: 'social' }>;
