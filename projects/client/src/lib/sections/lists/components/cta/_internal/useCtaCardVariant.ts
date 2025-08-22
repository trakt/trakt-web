import { useDefaultCardVariant } from '$lib/stores/useDefaultCardVariant.ts';
import type { Cta } from '../models/Cta.ts';

const EPISODIC_CTA: Cta[] = [
  'up-next',
  'upcoming',
  'personal-activity',
] as const;

export function useCtaCardVariant(cta: Cta) {
  return EPISODIC_CTA.includes(cta)
    ? useDefaultCardVariant('episode')
    : useDefaultCardVariant('movie');
}
