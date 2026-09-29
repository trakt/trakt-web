import type { YirPersonaId } from '$lib/requests/models/YirPersonaId.ts';

const BASE =
  'family=JetBrains+Mono:wght@400;600&family=Spline+Sans:wght@300..700';

const FAMILIES: Record<YirPersonaId, string> = {
  'anime-voyager': 'family=Dela+Gothic+One',
  'day-one-devotee': 'family=Archivo+Black',
  'weekend-marathoner': 'family=Shrikhand',
  'comfort-rewatcher': 'family=VT323&family=Permanent+Marker',
  omnivore: 'family=Bricolage+Grotesque:opsz,wght@12..96,400..800',
  'opening-night':
    'family=Abril+Fatface&family=Playfair+Display:ital,wght@1,400',
  cinephile:
    'family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:wght@400;600',
  critic:
    'family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=IBM+Plex+Sans:wght@400;700',
  loyalist:
    'family=Cormorant+Garamond:ital,wght@0,500;0,600;1,600&family=IBM+Plex+Sans:wght@400',
  curator: 'family=IBM+Plex+Sans:ital,wght@0,400;0,700;1,400',
  wildcard: 'family=Abril+Fatface',
  'opening-act': 'family=Caveat:wght@700',
};

export function personaFonts(ids: ReadonlyArray<YirPersonaId>): string {
  const families = [...new Set(ids.map((id) => FAMILIES[id]))];

  return `https://fonts.googleapis.com/css2?${
    [BASE, ...families].join('&')
  }&display=swap`;
}
