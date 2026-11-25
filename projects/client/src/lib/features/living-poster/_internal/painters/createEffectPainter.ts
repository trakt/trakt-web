import type { CanvasEffect } from '../../models/CanvasEffect.ts';
import type { EffectPainter } from '../../models/EffectPainter.ts';
import type { EffectSources } from '../../models/EffectSources.ts';
import { createDustPainter } from './createDustPainter.ts';
import { createEmbersPainter } from './createEmbersPainter.ts';
import { createFirefliesPainter } from './createFirefliesPainter.ts';
import { createFlarePainter } from './createFlarePainter.ts';
import { createFogPainter } from './createFogPainter.ts';
import { createLightningPainter } from './createLightningPainter.ts';
import { createRainPainter } from './createRainPainter.ts';
import { createSnowPainter } from './createSnowPainter.ts';
import { createTwinklePainter } from './createTwinklePainter.ts';

type CreateEffectPainterParams = {
  effect: CanvasEffect;
  seed: number;
  sources: EffectSources;
};

export function createEffectPainter({
  effect,
  seed,
  sources,
}: CreateEffectPainterParams): EffectPainter {
  switch (effect.kind) {
    case 'embers':
      return createEmbersPainter({ effect, seed });
    case 'snow':
      return createSnowPainter({ effect, seed });
    case 'dust':
      return createDustPainter({ effect, seed });
    case 'rain':
      return createRainPainter({ effect, seed });
    case 'fireflies':
      return createFirefliesPainter({ effect, seed });
    case 'twinkle':
      return createTwinklePainter({ effect, seed, backdrop: sources.backdrop });
    case 'fog':
      return createFogPainter({ effect });
    case 'flare':
      return createFlarePainter({ effect, seed });
    case 'lightning':
      return createLightningPainter({ effect, seed, figures: sources.figures });
    default: {
      const _exhaustive: never = effect;
      return _exhaustive;
    }
  }
}
