import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type CtaType =
  | 'up-next'
  | 'released'
  | 'activity'
  | 'upcoming'
  | 'personal-activity'
  | 'watchlist'
  | 'favorites'
  | 'social'
  | 'personal-list';

type CtaMap = {
  [K in CtaType]: K extends 'watchlist' | 'favorites'
    ? { type: K; mediaType?: MediaType }
    : { type: K };
};

export type Cta = CtaMap[CtaType];

export type MediaCta = Exclude<
  Cta,
  { type: 'activity' } | { type: 'social' } | { type: 'personal-list' }
>;
export type ListCta = Extract<Cta, { type: 'personal-list' }>;
export type SocialCta = Extract<Cta, { type: 'activity' } | { type: 'social' }>;
