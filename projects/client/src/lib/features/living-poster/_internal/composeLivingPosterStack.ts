import type { EffectBlend } from '../models/EffectBlend.ts';
import type { EffectPlane } from '../models/EffectPlane.ts';
import type { EffectSources } from '../models/EffectSources.ts';
import type { LivingPoster } from '../models/LivingPoster.ts';
import type { LivingPosterEffect } from '../models/LivingPosterEffect.ts';
import type { LivingPosterStackItem } from '../models/LivingPosterStackItem.ts';
import type { SeededCanvasEffect } from '../models/SeededCanvasEffect.ts';
import { canvasEffectPlanes } from './canvasEffectPlanes.ts';
import { isCanvasEffect } from './isCanvasEffect.ts';
import { resolveMaskSource } from './resolveMaskSource.ts';
import { toLivingPosterLayerRole } from './toLivingPosterLayerRole.ts';

type ComposablePoster = Pick<LivingPoster, 'layers' | 'mask' | 'effects'>;

type EffectItemParams = {
  poster: ComposablePoster;
  effect: LivingPosterEffect;
  key: string;
  shift: number;
};

const BEHIND_SHIFT = -0.15;
const FLARE_SHIFT = -0.6;
const FRONT_SHIFT = 1;
const BASE_SEED = 42;
const SEED_STEP = 101;

type CanvasGroupParams = {
  effects: ReadonlyArray<SeededCanvasEffect>;
  sources: EffectSources;
  key: string;
  plane: EffectPlane;
  blend: EffectBlend;
  shift: number;
};

const isAmbientBehind = ({ kind }: LivingPosterEffect) =>
  kind === 'haze' || kind === 'flicker' || kind === 'glow';

const isFlare = ({ effect }: SeededCanvasEffect) => effect.kind === 'flare';

const isOnBackground = (effect: LivingPosterEffect) =>
  effect.kind === 'bulbs' ||
  ((effect.kind === 'shimmer' || effect.kind === 'foil') &&
    effect.mask === 'letters');

const isTitleMasked = (effect: LivingPosterEffect) =>
  (effect.kind === 'shimmer' || effect.kind === 'foil') &&
  effect.mask === 'title';

const isBelowTitle = (shift: number) => {
  const role = toLivingPosterLayerRole(shift);
  return role === 'background' || role === 'mid' || role === 'figures';
};

const isCutoutLayer = ({
  shift,
  index,
  total,
}: {
  shift: number;
  index: number;
  total: number;
}) => {
  const role = toLivingPosterLayerRole(shift);
  if (role === null) return index === total - 1 && index > 0;

  return role === 'figures' || role === 'title';
};

const toEffectItem = ({
  poster,
  effect,
  key,
  shift,
}: EffectItemParams): LivingPosterStackItem => ({
  type: 'effect',
  key,
  effect,
  shift,
  mask: resolveMaskSource({ effect, poster }),
});

const toCanvasGroup = ({
  effects,
  sources,
  key,
  plane,
  blend,
  shift,
}: CanvasGroupParams): ReadonlyArray<LivingPosterStackItem> => {
  const grouped = effects.filter(
    ({ effect }) => canvasEffectPlanes(effect)[plane] === blend,
  );
  if (grouped.length === 0) return [];

  return [
    {
      type: 'canvas',
      key,
      effects: grouped,
      sources,
      plane,
      shift,
      isScreen: blend === 'screen',
    },
  ];
};

export function composeLivingPosterStack(
  poster: ComposablePoster,
): ReadonlyArray<LivingPosterStackItem> {
  const { layers, effects } = poster;
  const painted = effects
    .filter(isCanvasEffect)
    .map((effect, index) => ({ effect, seed: BASE_SEED + index * SEED_STEP }));
  const flares = painted.filter(isFlare);
  const unshifted = painted.filter((effect) => !isFlare(effect));
  const ambient = effects.filter(isAmbientBehind);
  const onBackground = effects.filter(isOnBackground);
  const front = effects.filter(
    (effect) =>
      !isCanvasEffect(effect) &&
      !isAmbientBehind(effect) &&
      !isOnBackground(effect),
  );

  const figuresIndex = layers.findIndex(
    ({ shift }) => toLivingPosterLayerRole(shift) === 'figures',
  );
  const figures = layers[figuresIndex];
  const sources: EffectSources = {
    backdrop: layers.at(0)?.src ?? null,
    figures: figures?.src ?? null,
  };

  const behind: ReadonlyArray<LivingPosterStackItem> = [
    ...ambient.map((effect, index) =>
      toEffectItem({
        poster,
        effect,
        key: `behind-${effect.kind}-${index}`,
        shift: BEHIND_SHIFT,
      }),
    ),
    ...toCanvasGroup({
      sources,
      effects: painted,
      key: 'canvas-back-screen',
      plane: 'back',
      blend: 'screen',
      shift: BEHIND_SHIFT,
    }),
    ...toCanvasGroup({
      sources,
      effects: painted,
      key: 'canvas-back-normal',
      plane: 'back',
      blend: 'normal',
      shift: BEHIND_SHIFT,
    }),
  ];

  const paintedFront: ReadonlyArray<LivingPosterStackItem> = [
    ...toCanvasGroup({
      sources,
      effects: unshifted,
      key: 'canvas-front-normal',
      plane: 'front',
      blend: 'normal',
      shift: FRONT_SHIFT,
    }),
    ...toCanvasGroup({
      sources,
      effects: unshifted,
      key: 'canvas-front-screen',
      plane: 'front',
      blend: 'screen',
      shift: FRONT_SHIFT,
    }),
    ...toCanvasGroup({
      sources,
      effects: flares,
      key: 'canvas-front-flare',
      plane: 'front',
      blend: 'screen',
      shift: FLARE_SHIFT,
    }),
  ];

  const backgroundShift = layers.at(0)?.shift ?? 0;
  const backdrop = toCanvasGroup({
    sources,
    effects: painted,
    key: 'canvas-backdrop-normal',
    plane: 'backdrop',
    blend: 'normal',
    shift: backgroundShift,
  });

  const rim = figures
    ? toCanvasGroup({
        sources,
        effects: painted,
        key: 'canvas-rim-screen',
        plane: 'rim',
        blend: 'screen',
        shift: figures.shift,
      })
    : [];

  const titleShift =
    layers.findLast(({ shift }, index) => index > 0 && !isBelowTitle(shift))
      ?.shift ?? FRONT_SHIFT;
  const frontShift = (effect: LivingPosterEffect) =>
    isTitleMasked(effect) ? titleShift : FRONT_SHIFT;
  const behindIndex =
    figuresIndex >= 0
      ? figuresIndex
      : layers.length > 1
        ? layers.length - 1
        : layers.length;

  const stack = layers.flatMap(
    ({ src, shift }, index): ReadonlyArray<LivingPosterStackItem> => [
      ...(index === behindIndex ? behind : []),
      {
        type: 'layer',
        key: `layer-${index}`,
        src,
        shift,
        isCutout: isCutoutLayer({ shift, index, total: layers.length }),
      },
      ...(index === figuresIndex ? rim : []),
      ...(index === 0 ? backdrop : []),
      ...(index === 0
        ? onBackground.map((effect, position) =>
            toEffectItem({
              poster,
              effect,
              key: `background-${effect.kind}-${position}`,
              shift: backgroundShift,
            }),
          )
        : []),
    ],
  );

  return [
    ...stack,
    ...(behindIndex === layers.length ? behind : []),
    ...front.map((effect, index) =>
      toEffectItem({
        poster,
        effect,
        key: `front-${effect.kind}-${index}`,
        shift: frontShift(effect),
      }),
    ),
    ...paintedFront,
  ];
}
