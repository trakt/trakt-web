type SpriteKind = 'glow' | 'streak';

type ParticleSpriteParams = {
  kind: SpriteKind;
  color: string;
};

const SIZES: Record<SpriteKind, readonly [width: number, height: number]> = {
  glow: [64, 64],
  streak: [2, 32],
};

const sprites = new Map<string, HTMLCanvasElement>();

function alphaMask(
  context: CanvasRenderingContext2D,
  kind: SpriteKind,
): CanvasGradient {
  const [width, height] = SIZES[kind];

  if (kind === 'streak') {
    const ramp = context.createLinearGradient(0, 0, 0, height);
    ramp.addColorStop(0, 'rgba(0, 0, 0, 0)');
    ramp.addColorStop(1, 'rgba(0, 0, 0, 1)');
    return ramp;
  }

  const halo = context.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    width / 2,
  );
  halo.addColorStop(0, 'rgba(0, 0, 0, 1)');
  halo.addColorStop(0.2, 'rgba(0, 0, 0, 1)');
  halo.addColorStop(0.45, 'rgba(0, 0, 0, 0.3)');
  halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
  return halo;
}

function createSprite({ kind, color }: ParticleSpriteParams) {
  const [width, height] = SIZES[kind];
  const sprite = document.createElement('canvas');
  sprite.width = width;
  sprite.height = height;

  const context = sprite.getContext('2d');
  if (!context) return sprite;

  context.fillStyle = color;
  context.fillRect(0, 0, width, height);
  context.globalCompositeOperation = 'destination-in';
  context.fillStyle = alphaMask(context, kind);
  context.fillRect(0, 0, width, height);

  return sprite;
}

export function particleSprite(params: ParticleSpriteParams) {
  const key = `${params.kind}:${params.color}`;
  const cached = sprites.get(key) ?? createSprite(params);
  sprites.set(key, cached);

  return cached;
}
