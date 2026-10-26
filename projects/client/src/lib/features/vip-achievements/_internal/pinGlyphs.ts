import type { PinGlyph } from './PinGlyph.ts';
import type { PinShape } from './PinShape.ts';
import { pinPaths } from './pinPaths.ts';

const { roundedRect, circle, polygon, sparkle, star, crescent } = pinPaths;

type ShapeOptions = Pick<PinShape, 'transform' | 'knockout'>;

const fill = (
  d: string,
  options: ShapeOptions & { round?: number } = {},
): PinShape => ({ kind: 'fill', d, ...options });

const stroke = (
  d: string,
  width: number,
  options: ShapeOptions = {},
): PinShape => ({ kind: 'stroke', d, width, ...options });

const ring = (count: number, radius: number, [cx, cy]: [number, number]) =>
  Array.from({ length: count }, (_, index): [number, number] => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  });

const clapperTurn = 'rotate(-15 16 43)';
const clapperBody = roundedRect(16, 47, 68, 37, 5);
const clapperArm = roundedRect(16, 31, 68, 11, 3);
const clapperBodyStripes = [22, 37, 52, 67]
  .map((x) =>
    polygon([
      [x, 58],
      [x + 6, 50],
      [x + 12, 50],
      [x + 6, 58],
    ]),
  )
  .join('');
const clapperArmStripes = [24, 39, 54, 69]
  .map((x) =>
    polygon([
      [x, 39.5],
      [x + 5, 33.5],
      [x + 11, 33.5],
      [x + 6, 39.5],
    ]),
  )
  .join('');

const ticketTurn = 'rotate(-12 50 50)';
const ticketOuter =
  'M18 30H82Q86 30 86 34V43A7 7 0 0 0 86 57V66Q86 70 82 70H18Q14 70 14 66V57A7 7 0 0 0 14 43V34Q14 30 18 30Z';
const ticketCuts =
  [36, 43, 50, 57, 64].map((y) => circle(63, y, 1.9)).join('') +
  polygon([
    [25, 50],
    [30.5, 44.5],
    [36, 50],
    [47, 39],
    [52.5, 44.5],
    [36, 61],
  ]);

const tvBody = roundedRect(14, 33, 72, 47, 9);
const tvAntenna = stroke('M50 33L36 16M50 33L64 16', 4.5);
const tvFeet = stroke('M27 80L24 87M73 80L76 87', 4.5);

const reelDisc = circle(46, 47, 33);
const reelHoles =
  ring(5, 18, [46, 47])
    .map(([x, y]) => circle(x, y, 8.6))
    .join('') + circle(46, 47, 3.6);
const reelTail = fill('M46 73H86.5A3.5 3.5 0 0 1 86.5 80H46Z');

const flagPole = fill(roundedRect(21, 13, 6, 76, 3));
const flagFrame = roundedRect(30, 17.5, 51, 36, 3);
const flagChecks = [0, 1, 2]
  .flatMap((row) =>
    [0, 1, 2, 3]
      .filter((column) => (row + column) % 2 === 0)
      .map(
        (column) =>
          `M${30 + column * 12.75} ${17.5 + row * 12}h12.75v12h-12.75Z`,
      ),
  )
  .join('');

const chainTurn = 'rotate(-45 50 50)';
const linkA = roundedRect(17, 40, 38, 20, 10);
const linkB = roundedRect(45, 40, 38, 20, 10);

const sunCore = circle(50, 50, 18);
const sunRays = ring(8, 1, [0, 0])
  .map(
    ([x, y]) => `M${50 + 26 * x} ${50 + 26 * y}L${50 + 36 * x} ${50 + 36 * y}`,
  )
  .join('');

const doubleBack = roundedRect(14, 14, 46, 46, 9);
const doubleFront = roundedRect(36, 36, 48, 48, 10);

const megaphoneShift = 'translate(-3 0)';

const nibTurn = 'rotate(40 50 55)';
const nibOuter = 'M50 90L32 57Q29 51 32 45L38 34H62L68 45Q71 51 68 57Z';
const nibCollar = fill(roundedRect(36, 20, 28, 10, 3), { transform: nibTurn });

const cardFront = roundedRect(30, 28, 40, 54, 6);
const cardBack = (x: number, transform: string, knockout = true) =>
  stroke(roundedRect(x, 22, 40, 52, 6), 5, {
    transform,
    knockout: knockout
      ? { d: cardFront, width: 10, isFilled: true }
      : undefined,
  });

/** One artwork per achievement theme, each in a 100-unit box. */
export const pinGlyphs = {
  clapper: {
    shapes: [
      fill(clapperBody + clapperBodyStripes),
      fill(clapperArm + clapperArmStripes, { transform: clapperTurn }),
    ],
    solid: [fill(clapperBody), fill(clapperArm, { transform: clapperTurn })],
  },
  ticket: {
    shapes: [fill(ticketOuter + ticketCuts, { transform: ticketTurn })],
    solid: [fill(ticketOuter, { transform: ticketTurn })],
  },
  tv: {
    shapes: [
      fill(
        tvBody +
          roundedRect(21, 40, 47, 33, 6) +
          circle(77.5, 49, 3.3) +
          circle(77.5, 62, 3.3),
      ),
      tvAntenna,
      tvFeet,
      fill(
        polygon([
          [40, 49],
          [40, 64],
          [53, 56.5],
        ]),
        { round: 3 },
      ),
    ],
    solid: [fill(tvBody), tvAntenna, tvFeet],
  },
  reel: {
    shapes: [fill(reelDisc + reelHoles), reelTail],
    solid: [fill(reelDisc), reelTail],
  },
  flag: {
    shapes: [flagPole, stroke(flagFrame, 3.5), fill(flagChecks)],
    solid: [flagPole, fill(flagFrame)],
  },
  chain: {
    shapes: [
      stroke(linkA, 7, {
        transform: chainTurn,
        knockout: {
          d: linkB,
          width: 13,
          isFilled: false,
          half: 'bottom',
          transform: chainTurn,
        },
      }),
      stroke(linkB, 7, {
        transform: chainTurn,
        knockout: {
          d: linkA,
          width: 13,
          isFilled: false,
          half: 'top',
          transform: chainTurn,
        },
      }),
    ],
  },
  moon: {
    shapes: [
      fill(crescent([45, 55, 31], [61, 41, 25])),
      fill(sparkle(76, 22, 10)),
      fill(sparkle(83, 53, 6.5)),
    ],
  },
  sun: {
    shapes: [
      fill(
        sunCore +
          polygon([
            [45, 41.5],
            [45, 58.5],
            [59.5, 50],
          ]),
      ),
      stroke(sunRays, 6),
    ],
    solid: [fill(sunCore), stroke(sunRays, 6)],
  },
  double: {
    shapes: [
      stroke(doubleBack, 6, {
        knockout: { d: doubleFront, width: 11, isFilled: true },
      }),
      fill(
        doubleFront +
          polygon([
            [53, 49],
            [53, 71],
            [72, 60],
          ]),
      ),
    ],
    solid: [stroke(doubleBack, 6), fill(doubleFront)],
  },
  megaphone: {
    shapes: [
      fill('M30 41L68 24.5Q75 21.5 75 29V71Q75 78.5 68 75.5L30 59Z', {
        transform: megaphoneShift,
      }),
      fill(roundedRect(17, 39, 15, 22, 4.5), { transform: megaphoneShift }),
      stroke('M42 62L46 76', 7, { transform: megaphoneShift }),
      stroke('M83 39Q88 50 83 61', 4.5, { transform: megaphoneShift }),
      stroke('M90 31Q98 50 90 69', 4.5, { transform: megaphoneShift }),
    ],
  },
  star: {
    shapes: [
      fill(star(46, 55, 29, 13), { round: 5 }),
      fill(sparkle(80, 22, 10)),
      fill(sparkle(84, 71, 6)),
    ],
  },
  nib: {
    shapes: [
      fill(
        nibOuter +
          polygon([
            [48.5, 61],
            [51.5, 61],
            [50.7, 87],
            [49.3, 87],
          ]) +
          circle(50, 57, 4.4),
        { transform: nibTurn },
      ),
      nibCollar,
    ],
    solid: [fill(nibOuter, { transform: nibTurn }), nibCollar],
  },
  cards: {
    shapes: [
      cardBack(22, 'rotate(-14 42 48)'),
      cardBack(38, 'rotate(14 58 48)'),
      fill(
        cardFront +
          roundedRect(38, 39, 24, 5, 2.5) +
          roundedRect(38, 51, 24, 5, 2.5) +
          roundedRect(38, 63, 16, 5, 2.5),
      ),
    ],
    solid: [
      cardBack(22, 'rotate(-14 42 48)', false),
      cardBack(38, 'rotate(14 58 48)', false),
      fill(cardFront),
    ],
  },
} satisfies Record<string, PinGlyph>;
