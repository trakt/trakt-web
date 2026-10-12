import type { Particle } from '../Particle.ts';
import type { ParticlePainter } from '../ParticlePainter.ts';
import { pickColor } from './pickColor.ts';

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type Firework = Particle & {
  targetY: number;
  speed: number;
  delay: number;
  sparks: Spark[];
  life: number;
  color: string;
};

const SPARK_COUNT = 36;
const BURST_LIFE = 90;
const GRAVITY = 0.035;
const DRAG = 0.975;

function burst(x: number, y: number): Spark[] {
  return Array.from({ length: SPARK_COUNT }, (_, index) => {
    const angle = (index / SPARK_COUNT) * Math.PI * 2;
    const power = Math.random() * 1.2 + 2;

    return {
      x,
      y,
      vx: Math.cos(angle) * power,
      vy: Math.sin(angle) * power,
    };
  });
}

export const fireworkPainter: ParticlePainter<Firework> = {
  areaPerParticle: 160000,
  maxCount: 6,
  colorTokens: [
    '--purple-200',
    '--purple-300',
    '--yellow-200',
    '--color-seasonal-snow',
  ],
  create: ({ bounds, colors, isInitial }) => ({
    x: bounds.width * (Math.random() * 0.8 + 0.1),
    y: bounds.height,
    targetY: bounds.height * (Math.random() * 0.35 + 0.1),
    speed: Math.random() * 2 + 6,
    delay: Math.round(Math.random() * (isInitial ? 160 : 90)),
    sparks: [],
    life: BURST_LIFE,
    color: pickColor(colors),
  }),
  step: (firework) => {
    if (firework.delay > 0) {
      firework.delay -= 1;
      return true;
    }

    if (firework.sparks.length === 0 && firework.y > firework.targetY) {
      firework.y -= firework.speed;
      firework.speed = Math.max(firework.speed * 0.985, 2.4);

      if (firework.y <= firework.targetY) {
        firework.sparks = burst(firework.x, firework.y);
      }

      return true;
    }

    firework.sparks.forEach((spark) => {
      spark.vx *= DRAG;
      spark.vy = spark.vy * DRAG + GRAVITY;
      spark.x += spark.vx;
      spark.y += spark.vy;
    });
    firework.life -= 1;

    return firework.life > 0;
  },
  draw: (ctx, firework) => {
    if (firework.delay > 0) return;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = firework.color;
    ctx.strokeStyle = firework.color;

    if (firework.sparks.length === 0) {
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(firework.x, firework.y);
      ctx.lineTo(firework.x, firework.y + firework.speed * 4);
      ctx.stroke();
      ctx.restore();
      return;
    }

    const fade = firework.life / BURST_LIFE;
    ctx.globalAlpha = fade;
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';

    firework.sparks.forEach((spark) => {
      ctx.beginPath();
      ctx.moveTo(spark.x, spark.y);
      ctx.lineTo(spark.x - spark.vx * 3, spark.y - spark.vy * 3);
      ctx.stroke();
    });

    if (fade > 0.85) {
      ctx.globalAlpha = (fade - 0.85) / 0.15;
      ctx.beginPath();
      ctx.arc(firework.x, firework.y, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },
};
