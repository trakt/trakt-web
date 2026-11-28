import { seededRandom } from '../shared/seededRandom.ts';

type SandFrontParams = {
  canvas: HTMLCanvasElement;
  enterFor: number;
  exitFor: number;
  leftAt: () => number | null;
};

type Grain = {
  y: number;
  lag: number;
  length: number;
  alpha: number;
  size: number;
};

const easeOut = (value: number) =>
  1 - (1 - Math.min(1, Math.max(0, value))) ** 3;

const createGrains = (): ReadonlyArray<Grain> => {
  const random = seededRandom(1218);
  return Array.from({ length: 700 }, () => ({
    y: random(),
    lag: random() ** 2.2 * 1.15 - 0.12,
    length: 6 + random() * 34,
    alpha: 0.25 + random() * 0.6,
    size: random() > 0.85 ? 1.8 : 1,
  }));
};

export function sandFront({
  canvas,
  enterFor,
  exitFor,
  leftAt,
}: SandFrontParams) {
  const context = canvas.getContext('2d');
  if (!context) return () => {};

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const grains = createGrains();
  const born = performance.now();
  let frame = 0;

  const drawFront = (progress: number, strength: number) => {
    if (progress <= 0 || progress >= 1 || strength <= 0) return;
    const front = -width * 0.15 + easeOut(progress) * width * 1.35;
    const band = context.createLinearGradient(
      front - width * 0.22,
      0,
      front + 40,
      0,
    );
    band.addColorStop(0, 'rgba(160, 100, 50, 0)');
    band.addColorStop(0.75, `rgba(196, 136, 72, ${0.32 * strength})`);
    band.addColorStop(1, 'rgba(230, 180, 120, 0)');
    context.fillStyle = band;
    context.fillRect(front - width * 0.22, 0, width * 0.22 + 40, height);

    context.lineCap = 'round';
    grains.forEach((grain) => {
      const x = front - grain.lag * width * 0.28;
      if (x < -40 || x > width + 40) return;
      const fade =
        Math.max(0, 1 - Math.max(0, grain.lag)) * grain.alpha * strength;
      context.strokeStyle = `rgba(236, 204, 156, ${fade})`;
      context.lineWidth = grain.size;
      context.beginPath();
      context.moveTo(x, grain.y * height);
      context.lineTo(
        x - grain.length * (0.6 + strength),
        grain.y * height - grain.length * 0.05,
      );
      context.stroke();
    });
  };

  const loop = (now: number) => {
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    drawFront((now - born) / enterFor, 1);
    const left = leftAt();
    if (left !== null) drawFront((now - left) / exitFor, 1);
    frame = requestAnimationFrame(loop);
  };

  frame = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(frame);
}
