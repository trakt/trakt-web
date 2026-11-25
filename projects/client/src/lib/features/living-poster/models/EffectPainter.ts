import type { EffectPlane } from './EffectPlane.ts';
import type { EffectScene } from './EffectScene.ts';

export type EffectPainter = Partial<
  Record<EffectPlane, (scene: EffectScene) => void>
>;
