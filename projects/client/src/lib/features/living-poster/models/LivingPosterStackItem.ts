import type { LivingPosterEffect } from './LivingPosterEffect.ts';
import type { ParticleEffect } from './ParticleEffect.ts';

export type LivingPosterStackItem =
  | {
      type: 'layer';
      key: string;
      src: string;
      shift: number;
      isCutout: boolean;
    }
  | {
      type: 'effect';
      key: string;
      effect: LivingPosterEffect;
      shift: number;
      mask: string | null;
    }
  | {
      type: 'particles';
      key: string;
      effects: ReadonlyArray<ParticleEffect>;
      shift: number;
      isScreen: boolean;
    };
