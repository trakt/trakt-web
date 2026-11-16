import z from 'zod';
import type { LivingPoster } from '../models/LivingPoster.ts';
import type { LivingPosterEffect } from '../models/LivingPosterEffect.ts';
import { parseLivingPosterEffect } from './parseLivingPosterEffect.ts';

const SUPPORTED_VERSION = 1;
const MAX_SHIFT = 1.5;
const FILE_NAME_PATTERN = /^[\w-]+\.webp$/;
const CUT_STAMP_PATTERN = /^[0-9a-f]{6,40}$/;

const FileNameSchema = z.string().regex(FILE_NAME_PATTERN);

const LivingPosterManifestSchema = z.object({
  v: z.literal(SUPPORTED_VERSION),
  layers: z.array(z.tuple([FileNameSchema, z.number().finite()])).min(1),
  mask: FileNameSchema.nullish(),
  effects: z.array(z.unknown()).nullish(),
  cut: z.string().regex(CUT_STAMP_PATTERN).nullish(),
});

type ParseLivingPosterParams = {
  raw: unknown;
  baseUrl: string;
};

const clampShift = (shift: number) =>
  Math.min(MAX_SHIFT, Math.max(-MAX_SHIFT, shift));

export function parseLivingPoster({
  raw,
  baseUrl,
}: ParseLivingPosterParams): LivingPoster | null {
  const parsed = LivingPosterManifestSchema.safeParse(raw);
  if (!parsed.success) return null;

  const { layers, mask, effects, cut } = parsed.data;
  const hasMask = mask != null;
  const toSrc = (file: string) =>
    cut ? `${baseUrl}/${file}?v=${cut}` : `${baseUrl}/${file}`;

  const parsedEffects = (effects ?? [])
    .map(parseLivingPosterEffect)
    .filter((effect): effect is LivingPosterEffect => effect !== null)
    .filter((effect) => {
      if (effect.kind !== 'shimmer' && effect.kind !== 'foil') return true;
      return effect.mask === 'letters' ? hasMask : layers.length > 1;
    });

  return {
    layers: layers.map(([file, shift]) => ({
      src: toSrc(file),
      shift: clampShift(shift),
    })),
    mask: hasMask ? toSrc(mask) : null,
    effects: parsedEffects,
  };
}
