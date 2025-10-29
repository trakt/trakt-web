import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type CtaType =
  | 'up-next'
  | 'start-watching'
  | 'released'
  | 'activity'
  | 'upcoming'
  | 'personal-activity'
  | 'watchlist'
  | 'favorites'
  | 'social'
  | 'personal-list';

type CtaAction = {
  disabled: boolean;
  onClick: () => void;
};

type MediaTypeCta = Extract<
  CtaType,
  | 'watchlist'
  | 'favorites'
  | 'up-next'
  | 'upcoming'
  | 'start-watching'
  | 'personal-activity'
>;

type CtaMap = {
  [K in CtaType]: K extends MediaTypeCta ? { type: K; mediaType?: MediaType }
    : (
      K extends 'personal-list'
        ? { type: K; action: CtaAction; mediaType?: MediaType }
        : { type: K }
    );
};

export type Cta = CtaMap[CtaType];

export type MediaCta = Exclude<
  Cta,
  { type: 'activity' } | { type: 'social' } | { type: 'personal-list' }
>;

export type ListCta = Extract<Cta, { type: 'personal-list' }>;
export type SocialCta = Extract<Cta, { type: 'activity' } | { type: 'social' }>;
