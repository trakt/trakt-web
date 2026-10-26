type Point = readonly [number, number];
type Circle = readonly [number, number, number];

const round = (value: number) => Math.round(value * 100) / 100;

const roundedRect = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) =>
  `M${round(x + radius)} ${round(y)}H${round(x + width - radius)}` +
  `A${radius} ${radius} 0 0 1 ${round(x + width)} ${round(y + radius)}` +
  `V${round(y + height - radius)}` +
  `A${radius} ${radius} 0 0 1 ${round(x + width - radius)} ${round(y + height)}` +
  `H${round(x + radius)}` +
  `A${radius} ${radius} 0 0 1 ${round(x)} ${round(y + height - radius)}` +
  `V${round(y + radius)}` +
  `A${radius} ${radius} 0 0 1 ${round(x + radius)} ${round(y)}Z`;

const circle = (cx: number, cy: number, radius: number) =>
  `M${round(cx - radius)} ${round(cy)}` +
  `a${radius} ${radius} 0 1 0 ${round(radius * 2)} 0` +
  `a${radius} ${radius} 0 1 0 ${round(-radius * 2)} 0Z`;

const polygon = (points: ReadonlyArray<Point>) =>
  `M${points.map(([x, y]) => `${round(x)} ${round(y)}`).join('L')}Z`;

const sparkle = (x: number, y: number, size: number) => {
  const pinch = size * 0.2;
  return (
    `M${round(x)} ${round(y - size)}` +
    `Q${round(x + pinch)} ${round(y - pinch)} ${round(x + size)} ${round(y)}` +
    `Q${round(x + pinch)} ${round(y + pinch)} ${round(x)} ${round(y + size)}` +
    `Q${round(x - pinch)} ${round(y + pinch)} ${round(x - size)} ${round(y)}` +
    `Q${round(x - pinch)} ${round(y - pinch)} ${round(x)} ${round(y - size)}Z`
  );
};

const star = (cx: number, cy: number, outer: number, inner: number) =>
  polygon(
    Array.from({ length: 10 }, (_, index): Point => {
      const angle = -Math.PI / 2 + (index * Math.PI) / 5;
      const radius = index % 2 === 0 ? outer : inner;
      return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
    }),
  );

/** The outer circle with the cut circle bitten out of it: a crescent moon. */
const crescent = ([x1, y1, r1]: Circle, [x2, y2, r2]: Circle) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.hypot(dx, dy);
  const along = (r1 * r1 - r2 * r2 + distance * distance) / (2 * distance);
  const half = Math.sqrt(r1 * r1 - along * along);
  const mx = x1 + (along * dx) / distance;
  const my = y1 + (along * dy) / distance;
  const start: Point = [
    mx + (half * dy) / distance,
    my - (half * dx) / distance,
  ];
  const end: Point = [mx - (half * dy) / distance, my + (half * dx) / distance];
  return (
    `M${round(start[0])} ${round(start[1])}` +
    `A${r1} ${r1} 0 1 0 ${round(end[0])} ${round(end[1])}` +
    `A${r2} ${r2} 0 0 1 ${round(start[0])} ${round(start[1])}Z`
  );
};

/** Path builders for the enamel pin artwork, all in a 100-unit glyph box. */
export const pinPaths = {
  roundedRect,
  circle,
  polygon,
  sparkle,
  star,
  crescent,
};
