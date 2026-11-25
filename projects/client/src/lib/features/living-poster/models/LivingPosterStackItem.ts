import type { EffectPlane } from './EffectPlane.ts';
import type { EffectSources } from './EffectSources.ts';
import type { LivingPosterEffect } from './LivingPosterEffect.ts';
import type { SeededCanvasEffect } from './SeededCanvasEffect.ts';

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
      type: 'canvas';
      key: string;
      effects: ReadonlyArray<SeededCanvasEffect>;
      plane: EffectPlane;
      sources: EffectSources;
      shift: number;
      isScreen: boolean;
    };
