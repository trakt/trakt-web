import type { YirPersonaId } from '$lib/requests/models/YirPersonaId.ts';

type PersonaPalette = {
  background: string;
  ink: string;
  accent: string;
  display: string;
  body: string;
};

const BODY = '"Spline Sans", Helvetica, Arial, sans-serif';
const PLEX = '"IBM Plex Sans", sans-serif';

const PALETTES: Record<YirPersonaId, PersonaPalette> = {
  'anime-voyager': {
    background: 'oklch(26.5% 0.088 287.0)',
    ink: 'oklch(100.0% 0.000 0.0)',
    accent: 'oklch(73.4% 0.186 355.3)',
    display: '"Dela Gothic One", sans-serif',
    body: BODY,
  },
  'day-one-devotee': {
    background: 'oklch(21.8% 0.021 352.3)',
    ink: 'oklch(100.0% 0.000 0.0)',
    accent: 'oklch(66.9% 0.219 20.9)',
    display: '"Archivo Black", sans-serif',
    body: BODY,
  },
  'weekend-marathoner': {
    background: 'oklch(91.1% 0.045 62.8)',
    ink: 'oklch(27.8% 0.089 9.1)',
    accent: 'oklch(53.9% 0.193 6.5)',
    display: '"Shrikhand", serif',
    body: BODY,
  },
  'comfort-rewatcher': {
    background: 'oklch(25.6% 0.018 165.5)',
    ink: 'oklch(98.1% 0.030 154.7)',
    accent: 'oklch(90.3% 0.175 150.4)',
    display: '"VT323", monospace',
    body: BODY,
  },
  omnivore: {
    background: 'oklch(22.2% 0.019 266.1)',
    ink: 'oklch(100.0% 0.000 0.0)',
    accent: 'oklch(78.6% 0.130 204.3)',
    display: '"Bricolage Grotesque", sans-serif',
    body: '"Bricolage Grotesque", sans-serif',
  },
  'opening-night': {
    background: 'oklch(22.3% 0.040 270.2)',
    ink: 'oklch(96.8% 0.033 83.7)',
    accent: 'oklch(84.3% 0.141 85.5)',
    display: '"Abril Fatface", serif',
    body: BODY,
  },
  cinephile: {
    background: 'oklch(23.7% 0.009 75.2)',
    ink: 'oklch(95.3% 0.010 87.5)',
    accent: 'oklch(73.1% 0.132 73.9)',
    display: '"Instrument Serif", serif',
    body: PLEX,
  },
  critic: {
    background: 'oklch(89.1% 0.034 86.3)',
    ink: 'oklch(21.8% 0.006 91.6)',
    accent: 'oklch(50.1% 0.178 28.7)',
    display: '"Playfair Display", serif',
    body: PLEX,
  },
  loyalist: {
    background: 'oklch(23.8% 0.015 76.2)',
    ink: 'oklch(95.3% 0.026 90.1)',
    accent: 'oklch(78.6% 0.102 84.2)',
    display: '"Cormorant Garamond", serif',
    body: PLEX,
  },
  curator: {
    background: 'oklch(89.6% 0.012 259.8)',
    ink: 'oklch(23.0% 0.004 106.7)',
    accent: 'oklch(50.5% 0.171 259.2)',
    display: PLEX,
    body: PLEX,
  },
  wildcard: {
    background: 'oklch(92.1% 0.026 305.8)',
    ink: 'oklch(22.8% 0.038 282.9)',
    accent: 'oklch(53.9% 0.193 6.5)',
    display: '"Abril Fatface", serif',
    body: BODY,
  },
  'opening-act': {
    background: 'oklch(29.8% 0.017 86.9)',
    ink: 'oklch(95.1% 0.012 96.4)',
    accent: 'oklch(88.0% 0.135 86.1)',
    display: '"Caveat", cursive',
    body: BODY,
  },
};

export function personaPalette(id: YirPersonaId): PersonaPalette {
  return PALETTES[id];
}
