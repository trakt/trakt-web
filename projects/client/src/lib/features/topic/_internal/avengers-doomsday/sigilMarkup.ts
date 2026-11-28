import { seededRandom } from '../shared/seededRandom.ts';

type SigilVariant = 'full' | 'ring';

type SigilMarkupParams = {
  seed?: number;
  variant?: SigilVariant;
};

type Point = readonly [number, number];

const GRID_X = 2.6;
const GRID_Y = 3.6;

const fixed = (value: number) => value.toFixed(2);

const polar = (radius: number, degrees: number): Point => {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return [radius * Math.cos(radians), radius * Math.sin(radians)];
};

const line = ([x1, y1]: Point, [x2, y2]: Point) =>
  `M${fixed(x1)} ${fixed(y1)}L${fixed(x2)} ${fixed(y2)}`;

const circle = (radius: number, attributes = '') =>
  `<circle r="${radius}" ${attributes}/>`;

const ticks = (radius: number, count: number, every: number) =>
  `<path d="${Array.from({ length: count }, (_, index) => {
    const angle = (index * 360) / count;
    const length = index % every === 0 ? 6 : 2.4;
    return line(polar(radius, angle), polar(radius - length, angle));
  }).join('')}"/>`;

const nodePoint = (node: number): Point => [
  ((node % 3) - 1) * GRID_X,
  (Math.floor(node / 3) - 1) * GRID_Y,
];

const neighbours = (node: number) =>
  [-4, -3, -2, -1, 1, 2, 3, 4]
    .map((offset) => node + offset)
    .filter(
      (candidate) =>
        candidate >= 0 &&
        candidate < 9 &&
        Math.abs((candidate % 3) - (node % 3)) <= 1 &&
        Math.abs(Math.floor(candidate / 3) - Math.floor(node / 3)) <= 1,
    );

const pick = <T>(
  items: ReadonlyArray<T>,
  random: () => number,
): T | undefined => items.at(Math.floor(random() * items.length));

const glyph = (random: () => number) => {
  const start = Math.floor(random() * 9);
  const strokeCount = 2 + Math.floor(random() * 3);
  const nodes = Array.from({ length: strokeCount }).reduce<
    ReadonlyArray<number>
  >(
    (path) => {
      const last = path.at(-1) ?? start;
      const next = pick(neighbours(last), random) ?? last;
      return [...path, next];
    },
    [start],
  );
  const strokes = nodes
    .slice(1)
    .map((node, index) =>
      line(nodePoint(nodes.at(index) ?? node), nodePoint(node)),
    )
    .join('');
  const [dotX, dotY] = nodePoint(Math.floor(random() * 9));
  const dot =
    random() > 0.6
      ? `<circle cx="${fixed(dotX)}" cy="${fixed(dotY)}" r="0.9"/>`
      : '';

  return `<path d="${strokes}"/>${dot}`;
};

const glyphRing = (radius: number, count: number, random: () => number) =>
  Array.from(
    { length: count },
    (_, index) =>
      `<g transform="rotate(${fixed((index * 360) / count)}) translate(0 ${-radius})">${glyph(random)}</g>`,
  ).join('');

const starPolygon = (radius: number, points: number, step: number) =>
  `<path d="${Array.from({ length: points }, (_, index) =>
    line(
      polar(radius, (index * 360) / points),
      polar(radius, (((index + step) % points) * 360) / points),
    ),
  ).join('')}"/>`;

const tips = (radius: number, count: number, size: number, offset = 0) =>
  Array.from({ length: count }, (_, index) => {
    const [x, y] = polar(radius, offset + (index * 360) / count);
    return `<circle cx="${fixed(x)}" cy="${fixed(y)}" r="${size}"/>`;
  }).join('');

const layer = (name: string, body: string) =>
  `<svg class="doom-sigil-layer" data-layer="${name}" viewBox="-100 -100 200 200">${body}</svg>`;

const fullLayers = (random: () => number) => [
  layer(
    'outer',
    `${circle(97)}${ticks(95, 144, 12)}${circle(89, 'stroke-dasharray="1 3"')}`,
  ),
  layer('glyphs', `${circle(87)}${circle(74)}${glyphRing(80.5, 30, random)}`),
  layer(
    'star',
    `${circle(70, 'class="doom-sigil-faint"')}${starPolygon(70, 8, 3)}${tips(70, 8, 2.2)}${circle(52)}${circle(58, 'stroke-dasharray="18 6 2 6"')}`,
  ),
  layer(
    'core',
    `${starPolygon(44, 6, 2)}${circle(44)}${circle(30)}${glyphRing(22.5, 8, random)}${circle(14)}${circle(3, 'class="doom-sigil-fill"')}`,
  ),
];

const ringLayers = (random: () => number) => [
  layer('outer', `${circle(96)}${ticks(95, 72, 6)}`),
  layer('glyphs', `${circle(86)}${glyphRing(78, 14, random)}${circle(70)}`),
];

export function sigilMarkup({
  seed = 1813,
  variant = 'full',
}: SigilMarkupParams = {}) {
  const random = seededRandom(seed);
  const layers = variant === 'full' ? fullLayers(random) : ringLayers(random);
  return `<span class="doom-sigil" data-variant="${variant}">${layers.join('')}</span>`;
}
