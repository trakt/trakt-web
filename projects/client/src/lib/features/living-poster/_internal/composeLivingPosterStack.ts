import type { LivingPoster } from '../models/LivingPoster.ts';
import type { LivingPosterEffect } from '../models/LivingPosterEffect.ts';
import type { LivingPosterStackItem } from '../models/LivingPosterStackItem.ts';
import { isParticleEffect } from './isParticleEffect.ts';
import { isScreenBlendedParticle } from './isScreenBlendedParticle.ts';
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

const isAmbientBehind = ({ kind }: LivingPosterEffect) =>
  kind === 'fog' || kind === 'haze' || kind === 'flicker' || kind === 'glow';

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

export function composeLivingPosterStack(
  poster: ComposablePoster,
): ReadonlyArray<LivingPosterStackItem> {
  const { layers, effects } = poster;
  const particles = effects.filter(isParticleEffect);
  const ambient = effects.filter(isAmbientBehind);
  const onBackground = effects.filter(isOnBackground);
  const front = effects.filter(
    (effect) =>
      !isParticleEffect(effect) &&
      !isAmbientBehind(effect) &&
      !isOnBackground(effect),
  );

  const particleGroups = [
    {
      key: 'particles-screen',
      isScreen: true,
      effects: particles.filter(isScreenBlendedParticle),
    },
    {
      key: 'particles-normal',
      isScreen: false,
      effects: particles.filter((effect) => !isScreenBlendedParticle(effect)),
    },
  ];

  const behind: ReadonlyArray<LivingPosterStackItem> = [
    ...ambient.map((effect, index) =>
      toEffectItem({
        poster,
        effect,
        key: `behind-${effect.kind}-${index}`,
        shift: BEHIND_SHIFT,
      }),
    ),
    ...particleGroups.flatMap(({ key, isScreen, effects: grouped }) =>
      grouped.length === 0
        ? []
        : [
            {
              type: 'particles' as const,
              key,
              effects: grouped,
              shift: BEHIND_SHIFT,
              isScreen,
            },
          ],
    ),
  ];

  const backgroundShift = layers.at(0)?.shift ?? 0;
  const titleShift =
    layers.findLast(({ shift }, index) => index > 0 && !isBelowTitle(shift))
      ?.shift ?? FRONT_SHIFT;
  const frontShift = (effect: LivingPosterEffect) => {
    if (effect.kind === 'flare') return FLARE_SHIFT;
    return isTitleMasked(effect) ? titleShift : FRONT_SHIFT;
  };
  const figuresIndex = layers.findIndex(
    ({ shift }) => toLivingPosterLayerRole(shift) === 'figures',
  );
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
  ];
}
