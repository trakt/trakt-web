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

const popcornTub = polygon([
  [22, 46],
  [78, 46],
  [69, 90],
  [31, 90],
]);
const popcornStripes =
  polygon([
    [35, 50],
    [42, 50],
    [41, 86],
    [36.5, 86],
  ]) +
  polygon([
    [58, 50],
    [65, 50],
    [63.5, 86],
    [59, 86],
  ]);
const popcornPuffs = [
  [29, 42, 10],
  [43, 33, 11],
  [58, 34, 11],
  [71, 42, 10],
].map(([x, y, r]) => fill(circle(x, y, r)));

const remoteTurn = 'rotate(-20 50 50)';
const remoteBody = roundedRect(34, 10, 32, 80, 11);
const remoteButtons =
  circle(50, 25, 6) +
  [
    [43, 43],
    [57, 43],
    [43, 55],
    [57, 55],
  ]
    .map(([x, y]) => circle(x, y, 3.6))
    .join('') +
  roundedRect(42, 67, 16, 5, 2.5);

const mountainRange = polygon([
  [8, 86],
  [42, 28],
  [58, 56],
  [70, 42],
  [94, 86],
]);
const mountainSnow =
  polygon([
    [42, 30],
    [34, 44],
    [39, 41],
    [43, 46],
    [48, 40],
  ]) +
  polygon([
    [70, 44],
    [65.5, 52],
    [69, 50],
    [72, 53],
    [74, 50],
  ]);
const mountainFlag = [
  stroke('M42 29V9', 3.5),
  fill(
    polygon([
      [42, 9],
      [57, 13.5],
      [42, 18],
    ]),
    { round: 1.5 },
  ),
];

const sunriseRays = [-90, -50, -130, -15, -165]
  .map((degrees) => {
    const angle = (degrees * Math.PI) / 180;
    return `M${50 + 30 * Math.cos(angle)} ${64 + 30 * Math.sin(angle)}L${50 + 40 * Math.cos(angle)} ${64 + 40 * Math.sin(angle)}`;
  })
  .join('');

const calendarBody = roundedRect(16, 22, 68, 64, 10);
const calendarCuts =
  roundedRect(22, 36, 56, 4, 2) +
  polygon([
    [33, 58],
    [40, 51],
    [47, 58],
    [61, 44],
    [68, 51],
    [47, 72],
  ]);
const calendarRings = stroke('M36 13V29M64 13V29', 6);

const candleFlame = 'M50 10Q65 29 58 39Q50 46 42 39Q35 29 50 10Z';
const candleFlameCut = 'M50 25Q55.5 32 52.5 36Q50 38.5 47.5 36Q44.5 32 50 25Z';
const candleBody = fill(roundedRect(36, 48, 28, 38, 5));
const candleWick = stroke('M50 41V48', 3);
const candleBase = fill(roundedRect(24, 86, 52, 7, 3.5));

const spectrumBars = [62, 52, 40, 28, 16]
  .map((top, index) => roundedRect(12 + index * 16, top, 12, 88 - top, 4))
  .join('');

const cloudOuter =
  'M24 64A13 13 0 0 1 27 38.2A20 20 0 0 1 66 32A16 16 0 0 1 77 64Z';
const bolt = polygon([
  [53, 56],
  [37, 80],
  [49, 80],
  [42, 97],
  [63, 69],
  [51, 69],
  [58, 56],
]);

const stopwatchFace = circle(50, 56, 33);
const stopwatchCuts =
  polygon([
    [48.1, 57.6],
    [51.9, 54.4],
    [64.8, 42.3],
    [61, 39.1],
  ]) +
  circle(50, 56, 4.5) +
  roundedRect(48, 28, 4, 7, 2) +
  roundedRect(73, 54, 7, 4, 2) +
  roundedRect(48, 77, 4, 7, 2) +
  roundedRect(20, 54, 7, 4, 2);
const stopwatchCrown = fill(
  roundedRect(42, 8, 16, 8, 3) + roundedRect(47, 14, 6, 10, 1.5),
);

const filmTurn = 'rotate(-12 50 50)';
const filmStrip = roundedRect(27, 8, 46, 84, 6);
const filmCuts =
  [14, 26, 38, 50, 62, 74]
    .flatMap((y) => [
      roundedRect(31, y, 5, 7, 1.5),
      roundedRect(64, y, 5, 7, 1.5),
    ])
    .join('') +
  [15, 38.5, 62].map((y) => roundedRect(40, y, 20, 19, 3)).join('');

const heart = 'M50 86L16 50A18 18 0 0 1 50 28A18 18 0 0 1 84 50Z';

const discCuts = circle(50, 52, 15) + circle(50, 52, 12) + circle(50, 52, 6.5);

const backHead = circle(63, 31, 13);
const backBody = 'M41 82A22 22 0 0 1 85 82Z';
const frontHead = circle(39, 42, 14);
const frontBody = 'M13 90A26 26 0 0 1 65 90Z';
const frontPerson = frontHead + frontBody;

const pennantStick = fill(roundedRect(16, 8, 7, 86, 3.5));
const pennantFlag = polygon([
  [23, 14],
  [88, 34],
  [23, 55],
]);

const hourglassGlass = polygon([
  [30, 20],
  [70, 20],
  [54, 50],
  [70, 80],
  [30, 80],
  [46, 50],
]);
const hourglassCaps = fill(
  roundedRect(22, 11, 56, 9, 3.5) + roundedRect(22, 80, 56, 9, 3.5),
);
const hourglassSand = fill(
  polygon([
    [38, 28],
    [62, 28],
    [52.5, 44],
    [47.5, 44],
  ]) +
    polygon([
      [36, 75],
      [64, 75],
      [50, 60],
    ]),
);

const trophyCup = 'M28 14H72V38A22 22 0 0 1 28 38Z';
const trophyHandles = stroke(
  'M28 21H20Q12 21 14 31Q16 41 29 44M72 21H80Q88 21 86 31Q84 41 71 44',
  5,
);
const trophyBase = fill(
  roundedRect(45, 58, 10, 14, 2) + roundedRect(30, 72, 40, 13, 4),
);

const clockFace = circle(50, 55, 34);
const clockCuts =
  roundedRect(47.5, 29, 5, 28, 2.5) +
  circle(50, 55, 5.5) +
  [0, 90, 180, 270]
    .filter((degrees) => degrees !== 0)
    .map((degrees) => {
      const angle = ((degrees - 90) * Math.PI) / 180;
      return circle(50 + 26 * Math.cos(angle), 55 + 26 * Math.sin(angle), 2.6);
    })
    .join('');

const frogHead =
  'M12 64A38 26 0 0 1 88 64A38 19 0 0 1 12 64Z' +
  'M31 66A30 10 0 0 0 69 66A22 16 0 0 1 31 66Z';
const frogEye = (x: number) => fill(circle(x, 40, 13) + circle(x, 40, 5.5));

const loopArc = 'M69.3 27A30 30 0 1 1 30.7 27';
const loopHead = polygon([
  [39.9, 19.3],
  [36.1, 38.1],
  [20.7, 19.7],
]);

/** One artwork per achievement theme, each in a 100-unit box. */
export const pinGlyphs = {
  clapper: {
    optical: 0.9,
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
    optical: 0.92,
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
    optical: 0.96,
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
    optical: 0.96,
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
    optical: 0.88,
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
      fill('M30 41L68 24.5Q75 21.5 75 29V71Q75 78.5 68 75.5L30 59Z'),
      fill(roundedRect(17, 39, 15, 22, 4.5)),
      stroke('M42 62L46 76', 7),
      stroke('M83 39Q88 50 83 61', 4.5),
      stroke('M90 31Q98 50 90 69', 4.5),
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
    optical: 0.88,
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
  popcorn: {
    shapes: [...popcornPuffs, fill(popcornTub + popcornStripes)],
    solid: [...popcornPuffs, fill(popcornTub)],
  },
  remote: {
    optical: 0.92,
    shapes: [fill(remoteBody + remoteButtons, { transform: remoteTurn })],
    solid: [fill(remoteBody, { transform: remoteTurn })],
  },
  rewind: {
    shapes: [
      fill(
        polygon([
          [50, 26],
          [50, 74],
          [12, 50],
        ]),
        { round: 4 },
      ),
      fill(
        polygon([
          [88, 26],
          [88, 74],
          [50, 50],
        ]),
        { round: 4 },
      ),
    ],
  },
  mountain: {
    shapes: [fill(mountainRange + mountainSnow, { round: 3 }), ...mountainFlag],
    solid: [fill(mountainRange, { round: 3 }), ...mountainFlag],
  },
  sunrise: {
    shapes: [
      fill('M27 64A23 23 0 0 1 73 64Z'),
      fill(roundedRect(10, 68, 80, 8, 4)),
      fill(roundedRect(26, 81, 48, 7, 3.5)),
      stroke(sunriseRays, 6),
    ],
  },
  calendar: {
    optical: 0.92,
    shapes: [fill(calendarBody + calendarCuts), calendarRings],
    solid: [fill(calendarBody), calendarRings],
  },
  candle: {
    shapes: [
      fill(candleFlame + candleFlameCut),
      candleWick,
      candleBody,
      candleBase,
    ],
    solid: [fill(candleFlame), candleWick, candleBody, candleBase],
  },
  bars: {
    optical: 0.9,
    shapes: [fill(spectrumBars)],
  },
  storm: {
    shapes: [fill(cloudOuter), fill(bolt, { round: 2 })],
  },
  stopwatch: {
    shapes: [fill(stopwatchFace + stopwatchCuts), stopwatchCrown],
    solid: [fill(stopwatchFace), stopwatchCrown],
  },
  film: {
    shapes: [fill(filmStrip + filmCuts, { transform: filmTurn })],
    solid: [fill(filmStrip, { transform: filmTurn })],
  },
  heart: {
    shapes: [fill(heart, { round: 4 }), fill(sparkle(82, 20, 9))],
  },
  disc: {
    shapes: [fill(circle(50, 52, 36) + discCuts), fill(sparkle(84, 18, 9))],
    solid: [fill(circle(50, 52, 36)), fill(sparkle(84, 18, 9))],
  },
  people: {
    shapes: [
      fill(backHead, {
        knockout: { d: frontPerson, width: 9, isFilled: true },
      }),
      fill(backBody, {
        knockout: { d: frontPerson, width: 9, isFilled: true },
      }),
      fill(frontPerson),
    ],
    solid: [fill(backHead), fill(backBody), fill(frontPerson)],
  },
  pennant: {
    shapes: [
      pennantStick,
      fill(pennantFlag + star(44, 35, 9, 4), { round: 3 }),
    ],
    solid: [pennantStick, fill(pennantFlag, { round: 3 })],
  },
  hourglass: {
    optical: 0.94,
    shapes: [stroke(hourglassGlass, 5), hourglassCaps, hourglassSand],
    solid: [fill(hourglassGlass), hourglassCaps],
  },
  trophy: {
    shapes: [fill(trophyCup + star(50, 32, 9, 4)), trophyHandles, trophyBase],
    solid: [fill(trophyCup), trophyHandles, trophyBase],
  },
  clock: {
    shapes: [
      fill(clockFace + clockCuts),
      fill(sparkle(84, 16, 10)),
      fill(sparkle(16, 20, 6)),
    ],
    solid: [
      fill(clockFace),
      fill(sparkle(84, 16, 10)),
      fill(sparkle(16, 20, 6)),
    ],
  },
  frog: {
    shapes: [fill(frogHead), frogEye(31), frogEye(69)],
    solid: [
      fill('M12 64A38 26 0 0 1 88 64A38 19 0 0 1 12 64Z'),
      fill(circle(31, 40, 13)),
      fill(circle(69, 40, 13)),
    ],
  },
  loop: {
    shapes: [stroke(loopArc, 9), fill(loopHead, { round: 2 })],
  },
  mystery: {
    shapes: [
      stroke('M35 34Q35 17 50 17Q65 17 65 32Q65 43 54 48Q50 50 50 58', 10),
      fill(circle(50, 76, 7)),
    ],
  },
} satisfies Record<string, PinGlyph>;
