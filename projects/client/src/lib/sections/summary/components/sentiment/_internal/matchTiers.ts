import * as m from '$lib/features/i18n/messages.ts';
import type { MatchKind } from '$lib/requests/models/MatchKind.ts';
import type { MatchLevel } from './matchLevel.ts';

type ScoredLevel = Exclude<MatchLevel, 0>;

type MatchTier = {
  label: () => string;
  color: string;
  glow: number;
  sweep: number;
};

const LOW_COLOR =
  'color-mix(in srgb, var(--color-text-secondary) 70%, transparent)';

const MATCH_TIERS: Record<ScoredLevel, MatchTier> = {
  1: {
    label: () => m.match_tier_not_your_usual(),
    color: LOW_COLOR,
    glow: 0,
    sweep: 0.12,
  },
  2: {
    label: () => m.match_tier_maybe(),
    color: 'var(--blue-300)',
    glow: 0,
    sweep: 0.45,
  },
  3: {
    label: () => m.match_tier_good_fit(),
    color: 'var(--green-400)',
    glow: 0.3,
    sweep: 0.75,
  },
  4: {
    label: () => m.match_tier_top_pick(),
    color: 'var(--yellow-400)',
    glow: 0.45,
    sweep: 1,
  },
};

const HYPE_TIERS: Record<ScoredLevel, MatchTier> = {
  1: MATCH_TIERS[1],
  2: { ...MATCH_TIERS[2], color: 'var(--orange-200)' },
  3: {
    ...MATCH_TIERS[3],
    label: () => m.hype_tier_looking_good(),
    color: 'var(--orange-300)',
  },
  4: {
    ...MATCH_TIERS[4],
    label: () => m.hype_tier_cant_wait(),
    color: 'var(--orange-400)',
  },
};

export function matchTiers(kind: MatchKind): Record<ScoredLevel, MatchTier> {
  return kind === 'hype' ? HYPE_TIERS : MATCH_TIERS;
}
