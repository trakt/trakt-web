type ToothRingParams = {
  radius: number;
  count: number;
  length: number;
  width: number;
};

export function toothRing({ radius, count, length, width }: ToothRingParams) {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    const half = width / radius / 2;
    const point = (r: number, a: number) =>
      `${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`;
    return `M${point(radius, angle - half)} Q${point(radius - length * 0.55, angle - half * 0.2)} ${point(radius - length, angle + half * 0.15)} Q${point(radius - length * 0.4, angle + half * 0.6)} ${point(radius, angle + half)} Z`;
  }).join(' ');
}
