import type { Particle, ParticlePainter } from '../ParticlePainter.ts';
import { pickColor } from './pickColor.ts';

type Confetti = Particle & {
  width: number;
  height: number;
  fall: number;
  angle: number;
  spin: number;
  flip: number;
  flipSpeed: number;
  sway: number;
  color: string;
};

export const confettiPainter: ParticlePainter<Confetti> = {
  areaPerParticle: 16000,
  maxCount: 72,
  colorTokens: [
    '--purple-200',
    '--purple-300',
    '--purple-400',
    '--color-seasonal-snow',
  ],
  create: ({ bounds, colors, isInitial }) => ({
    x: Math.random() * bounds.width,
    y: isInitial ? Math.random() * bounds.height : -10,
    width: Math.random() * 3 + 3,
    height: Math.random() * 2 + 1.5,
    fall: Math.random() * 0.5 + 0.4,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.04,
    flip: Math.random() * Math.PI * 2,
    flipSpeed: Math.random() * 0.06 + 0.02,
    sway: Math.random() * 0.6 + 0.2,
    color: pickColor(colors),
  }),
  step: (piece, bounds) => {
    piece.y += piece.fall;
    piece.angle += piece.spin;
    piece.flip += piece.flipSpeed;
    piece.x += Math.sin(piece.flip * 0.5) * piece.sway;

    return piece.y <= bounds.height + 10;
  },
  draw: (ctx, piece) => {
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.angle);
    ctx.scale(Math.cos(piece.flip), 1);

    ctx.globalAlpha = 0.75;
    ctx.fillStyle = piece.color;
    ctx.fillRect(
      -piece.width / 2,
      -piece.height / 2,
      piece.width,
      piece.height,
    );

    ctx.restore();
  },
};
