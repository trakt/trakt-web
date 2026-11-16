import type { LivingPoster } from '../models/LivingPoster.ts';
import type { LivingPosterEffect } from '../models/LivingPosterEffect.ts';
import type { LivingPosterStackItem } from '../models/LivingPosterStackItem.ts';
import { isParticleEffect } from './isParticleEffect.ts';
import { resolveMaskSource } from './resolveMaskSource.ts';

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
  kind === 'fog' || kind === 'haze';

const isOnBackground = ({ kind }: LivingPosterEffect) =>
  kind === 'bulbs' || kind === 'shimmer' || kind === 'foil';

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

  const behind: ReadonlyArray<LivingPosterStackItem> = [
    ...ambient.map((effect, index) =>
      toEffectItem({
        poster,
        effect,
        key: `behind-${effect.kind}-${index}`,
        shift: BEHIND_SHIFT,
      }),
    ),
    ...(particles.length === 0
      ? []
      : [
          {
            type: 'particles' as const,
            key: 'particles',
            effects: particles,
            shift: BEHIND_SHIFT,
          },
        ]),
  ];

  const backgroundShift = layers.at(0)?.shift ?? 0;
  const behindIndex = layers.length > 1 ? layers.length - 1 : layers.length;

  const stack = layers.flatMap(
    ({ src, shift }, index): ReadonlyArray<LivingPosterStackItem> => [
      ...(index === behindIndex ? behind : []),
      {
        type: 'layer',
        key: `layer-${index}`,
        src,
        shift,
        isCutout: index === layers.length - 1 && index > 0,
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
        shift: effect.kind === 'flare' ? FLARE_SHIFT : FRONT_SHIFT,
      }),
    ),
  ];
}
