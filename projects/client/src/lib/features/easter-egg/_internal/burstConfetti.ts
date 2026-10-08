import { pickRandom } from '$lib/utils/array/pickRandom.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { clamp } from '$lib/utils/number/clamp.ts';
import { random } from '$lib/utils/number/random.ts';
import { time } from '$lib/utils/timing/time.ts';

type Point = {
  x: number;
  y: number;
};

type BurstConfettiParams = {
  canvas: HTMLCanvasElement;
  origin: Point;
  colors: ReadonlyArray<string>;
};

type Piece = {
  vx: number;
  vy: number;
  rotation: number;
  spin: number;
  width: number;
  height: number;
  gravity: number;
  life: number;
  color: string;
};

const PIECE_COUNT = 80;
const GRAVITY = 0.22;
const DRAG = 0.985;
const FADE_PER_FRAME = 0.013;
const REFERENCE_WIDTH = 600;

function createPiece(scale: number, colors: ReadonlyArray<string>): Piece {
  const angle = random(0, Math.PI * 2);
  const speed = random(2, 10) * scale;

  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 2.5 * scale,
    rotation: random(0, Math.PI),
    spin: random(-0.225, 0.225),
    width: random(4, 10) * scale,
    height: random(2, 5) * scale,
    gravity: GRAVITY * scale,
    life: random(0.7, 1),
    color: pickRandom(colors) ?? '',
  };
}

function isAlive(piece: Piece, frame: number) {
  return frame * FADE_PER_FRAME < piece.life;
}

function drawPiece(
  context: CanvasRenderingContext2D,
  { piece, origin, frame }: { piece: Piece; origin: Point; frame: number },
) {
  const drift = (1 - DRAG ** frame) / (1 - DRAG);
  const x = origin.x + piece.vx * drift;
  const y = origin.y + piece.vy * drift + 0.5 * piece.gravity * frame ** 2;
  const rotation = piece.rotation + piece.spin * frame;

  context.save();
  context.globalAlpha = 1 - (frame * FADE_PER_FRAME) / piece.life;
  context.translate(x, y);
  context.rotate(rotation);
  context.fillStyle = piece.color;
  context.fillRect(
    -piece.width / 2,
    -piece.height / 2,
    piece.width,
    piece.height * Math.abs(Math.cos(rotation * 2)) + 0.5,
  );
  context.restore();
}

export function burstConfetti(
  { canvas, origin, colors }: BurstConfettiParams,
): () => void {
  const context = canvas.getContext('2d');
  if (!context) return NOOP_FN;

  const { width, height } = canvas.getBoundingClientRect();
  const ratio = Math.min(2, globalThis.devicePixelRatio || 1);
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const scale = clamp({ value: width / REFERENCE_WIDTH, min: 0.7, max: 1.6 });
  const pieces = Array.from(
    { length: PIECE_COUNT },
    () => createPiece(scale, colors),
  );
  const start = performance.now();

  let request = 0;

  const draw = (now: number) => {
    const frame = (now - start) / time.fps(60);
    const alive = pieces.filter((piece) => isAlive(piece, frame));

    context.clearRect(0, 0, width, height);
    alive.forEach((piece) => drawPiece(context, { piece, origin, frame }));

    request = alive.length > 0 ? requestAnimationFrame(draw) : 0;
  };

  request = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(request);
    context.clearRect(0, 0, width, height);
  };
}
