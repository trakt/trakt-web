import type { Attachment } from 'svelte/attachments';
import type { EffectPlane } from '../models/EffectPlane.ts';
import type { EffectSources } from '../models/EffectSources.ts';
import type { LivingPosterPainter } from '../models/LivingPosterPainter.ts';
import type { SeededCanvasEffect } from '../models/SeededCanvasEffect.ts';
import { observeSize } from './observeSize.ts';
import { createEffectPainter } from './painters/createEffectPainter.ts';

type EffectCanvasParams = {
  effects: ReadonlyArray<SeededCanvasEffect>;
  plane: EffectPlane;
  sources: EffectSources;
  addPainter: (painter: LivingPosterPainter) => () => void;
};

const MAX_PIXEL_RATIO = 2;
const UNIT_WIDTH = 300;

export function effectCanvas({
  effects,
  plane,
  sources,
  addPainter,
}: EffectCanvasParams): Attachment<HTMLCanvasElement> {
  return (canvas) => {
    const context = canvas.getContext('2d');
    if (!context) return;

    const paints = effects.flatMap(({ effect, seed }) => {
      const paint = createEffectPainter({ effect, seed, sources })[plane];
      return paint ? [paint] : [];
    });
    const size = { width: 0, height: 0 };
    const setPlaneFilter = (filter: string) => {
      const host = canvas.parentElement;
      if (host && host.style.filter !== filter) host.style.filter = filter;
    };

    const resize = () => {
      const ratio = Math.min(globalThis.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      size.width = canvas.clientWidth;
      size.height = canvas.clientHeight;
      canvas.width = Math.round(size.width * ratio);
      canvas.height = Math.round(size.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const stopObserving = observeSize(canvas, resize);

    const removePainter = addPainter(({ seconds, tilt }) => {
      const { width, height } = size;
      context.clearRect(0, 0, width, height);
      if (width === 0 || height === 0) return;

      for (const paint of paints) {
        context.save();
        paint({
          context,
          width,
          height,
          unit: width / UNIT_WIDTH,
          seconds,
          tilt,
          setPlaneFilter,
        });
        context.restore();
      }
    });

    return () => {
      stopObserving();
      removePainter();
      setPlaneFilter('');
    };
  };
}
