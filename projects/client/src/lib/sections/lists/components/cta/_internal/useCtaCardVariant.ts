import { useDefaultCardVariant } from '$lib/stores/useDefaultCardVariant.ts';
import type { Cta, CtaType } from '../models/Cta.ts';

const EPISODIC_CTA: CtaType[] = [
  'up-next',
  'upcoming',
  'personal-activity',
] as const;

export function useCtaCardVariant(cta: Cta) {
  return EPISODIC_CTA.includes(cta.type)
    ? useDefaultCardVariant('episode')
    : useDefaultCardVariant('movie');
}
