import type { Attachment } from 'svelte/attachments';
import type { LivingPosterPainter } from '../models/LivingPosterPainter.ts';
import type { ParticleEffect } from '../models/ParticleEffect.ts';
import { createParticles } from './createParticles.ts';
import { drawParticles } from './drawParticles.ts';

type ParticleCanvasParams = {
  effects: ReadonlyArray<ParticleEffect>;
  addPainter: (painter: LivingPosterPainter) => () => void;
};

const MAX_PIXEL_RATIO = 2;
const BASE_SEED = 42;
const SEED_STEP = 101;

export function particleCanvas({
  effects,
  addPainter,
}: ParticleCanvasParams): Attachment<HTMLCanvasElement> {
  return (canvas) => {
    const context = canvas.getContext('2d');
    if (!context) return;

    const particles = effects.flatMap((effect, index) =>
      createParticles({ effect, seed: BASE_SEED + index * SEED_STEP }),
    );
    const size = { width: 0, height: 0 };

    const resize = () => {
      const ratio = Math.min(globalThis.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      size.width = canvas.clientWidth;
      size.height = canvas.clientHeight;
      canvas.width = Math.round(size.width * ratio);
      canvas.height = Math.round(size.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const removePainter = addPainter(({ seconds }) =>
      drawParticles({
        context,
        particles,
        seconds,
        width: size.width,
        height: size.height,
      }),
    );

    return () => {
      observer.disconnect();
      removePainter();
    };
  };
}
