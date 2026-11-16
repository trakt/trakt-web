import type { YirPersonaId } from '$lib/requests/models/YirPersonaId.ts';

type FontStyle = 'normal' | 'italic';

type PersonaShareFontFace = {
  name: string;
  weight: number;
  style: FontStyle;
};

const face = (
  name: string,
  weight = 400,
  style: FontStyle = 'normal',
): PersonaShareFontFace => ({ name, weight, style });

const BASE = [
  face('JetBrains Mono'),
  face('JetBrains Mono', 600),
  face('Spline Sans'),
  face('Spline Sans', 600),
  face('Spline Sans', 700),
];

const PLEX = [face('IBM Plex Sans'), face('IBM Plex Sans', 700)];

const FACES: Record<YirPersonaId, ReadonlyArray<PersonaShareFontFace>> = {
  'anime-voyager': [face('Dela Gothic One')],
  'day-one-devotee': [face('Archivo Black')],
  'weekend-marathoner': [face('Shrikhand')],
  'comfort-rewatcher': [face('VT323'), face('Permanent Marker')],
  omnivore: [
    face('Bricolage Grotesque'),
    face('Bricolage Grotesque', 700),
    face('Bricolage Grotesque', 800),
    face('VT323'),
  ],
  'opening-night': [
    face('Abril Fatface'),
    face('Playfair Display', 400, 'italic'),
  ],
  cinephile: [
    face('Instrument Serif'),
    face('Instrument Serif', 400, 'italic'),
    ...PLEX,
    face('IBM Plex Sans', 600),
  ],
  critic: [
    face('Playfair Display', 700),
    face('Playfair Display', 900),
    face('Playfair Display', 400, 'italic'),
    ...PLEX,
  ],
  loyalist: [
    face('Cormorant Garamond', 500),
    face('Cormorant Garamond', 600),
    face('Cormorant Garamond', 600, 'italic'),
    ...PLEX,
  ],
  curator: [...PLEX, face('IBM Plex Sans', 400, 'italic')],
  wildcard: [face('Abril Fatface')],
  'opening-act': [face('Caveat', 700)],
};

export function personaShareFontFaces(
  persona: YirPersonaId,
): ReadonlyArray<PersonaShareFontFace> {
  return [...BASE, ...FACES[persona]];
}
