type GlowSpriteParams = {
  color: string;
  isSoft?: boolean;
};

const SIZE = 64;
const sprites = new Map<string, HTMLCanvasElement>();

function addStops(gradient: CanvasGradient, isSoft: boolean) {
  const stops: ReadonlyArray<readonly [number, number]> = isSoft
    ? [
        [0, 1],
        [0.35, 0.35],
        [1, 0],
      ]
    : [
        [0, 1],
        [0.2, 1],
        [0.45, 0.3],
        [1, 0],
      ];

  for (const [at, alpha] of stops) {
    gradient.addColorStop(at, `rgba(0, 0, 0, ${alpha})`);
  }

  return gradient;
}

function createSprite({ color, isSoft = false }: GlowSpriteParams) {
  const sprite = document.createElement('canvas');
  sprite.width = SIZE;
  sprite.height = SIZE;

  const context = sprite.getContext('2d');
  if (!context) return sprite;

  const half = SIZE / 2;
  context.fillStyle = color;
  context.fillRect(0, 0, SIZE, SIZE);
  context.globalCompositeOperation = 'destination-in';
  context.fillStyle = addStops(
    context.createRadialGradient(half, half, 0, half, half, half),
    isSoft,
  );
  context.fillRect(0, 0, SIZE, SIZE);

  return sprite;
}

export function glowSprite(params: GlowSpriteParams) {
  const key = `${params.color}:${params.isSoft ? 'soft' : 'core'}`;
  const cached = sprites.get(key) ?? createSprite(params);
  sprites.set(key, cached);

  return cached;
}
