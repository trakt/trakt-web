export type PosterBox = readonly [
  x: number,
  y: number,
  width: number,
  height: number,
];

export type PosterPoint = readonly [x: number, y: number];

type EffectBase = {
  color: string | null;
  intensity: number;
  box: PosterBox;
};

export type LivingPosterEffect = EffectBase &
  (
    | {
        kind:
          | 'embers'
          | 'rain'
          | 'lightning'
          | 'twinkle'
          | 'fog'
          | 'haze'
          | 'snow'
          | 'fireflies'
          | 'dust'
          | 'flicker'
          | 'glow';
      }
    | { kind: 'bulbs'; points: ReadonlyArray<PosterPoint> }
    | { kind: 'flare'; at: PosterPoint }
    | { kind: 'shimmer' | 'foil'; mask: 'letters' | 'title' }
  );

export type LivingPosterEffectKind = LivingPosterEffect['kind'];
