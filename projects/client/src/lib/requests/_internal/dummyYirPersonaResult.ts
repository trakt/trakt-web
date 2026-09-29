import type { YirPersonaId } from '../models/YirPersonaId.ts';
import type {
  YirHighlight,
  YirPersonaResult,
  YirTraitId,
} from '../models/YirPersonaResult.ts';

type PersonaFixture = {
  runnerUp: YirPersonaId | null;
  rarity: number;
  streak: number;
  traits: YirTraitId[];
  highlights: YirHighlight[];
};

const FIXTURES: Record<YirPersonaId, PersonaFixture> = {
  'anime-voyager': {
    runnerUp: 'critic',
    rarity: 6,
    streak: 205,
    traits: ['streak-keeper', 'polariser', 'automaton'],
    highlights: [
      { kind: 'anime-episodes', value: 2453 },
      { kind: 'anime-share', value: 97 },
      { kind: 'streak-days', value: 205 },
    ],
  },
  'day-one-devotee': {
    runnerUp: 'weekend-marathoner',
    rarity: 8,
    streak: 108,
    traits: ['streak-keeper', 'doc-nerd', 'silent-watcher'],
    highlights: [
      { kind: 'premiere-share', value: 75 },
      { kind: 'streak-days', value: 108 },
      { kind: 'premieres', value: 363 },
    ],
  },
  'weekend-marathoner': {
    runnerUp: 'comfort-rewatcher',
    rarity: 14,
    streak: 10,
    traits: ['weekend-warrior', 'time-traveler'],
    highlights: [
      { kind: 'weekend-share', value: 67 },
      { kind: 'binge-days', value: 30 },
      { kind: 'plays-per-day', value: 7.7 },
    ],
  },
  'comfort-rewatcher': {
    runnerUp: 'loyalist',
    rarity: 11,
    streak: 5,
    traits: ['app-hopper'],
    highlights: [
      { kind: 'catalog-share', value: 74 },
      { kind: 'top-show-episodes', value: 144 },
      { kind: 'apps', value: 8 },
    ],
  },
  omnivore: {
    runnerUp: 'weekend-marathoner',
    rarity: 7,
    streak: 34,
    traits: ['automaton', 'silent-watcher'],
    highlights: [
      { kind: 'shows', value: 91 },
      { kind: 'networks', value: 33 },
      { kind: 'binge-days', value: 72 },
    ],
  },
  'opening-night': {
    runnerUp: 'day-one-devotee',
    rarity: 9,
    streak: 69,
    traits: ['live-checker', 'streak-keeper'],
    highlights: [
      { kind: 'checkin-share', value: 95 },
      { kind: 'new-releases', value: 76 },
    ],
  },
  cinephile: {
    runnerUp: 'critic',
    rarity: 8,
    streak: 9,
    traits: ['hype-machine', 'social-butterfly'],
    highlights: [
      { kind: 'avg-runtime', value: 127 },
      { kind: 'avg-vintage', value: 2007 },
      { kind: 'pre-2000', value: 14 },
    ],
  },
  critic: {
    runnerUp: 'cinephile',
    rarity: 7,
    streak: 29,
    traits: ['social-butterfly', 'tough-crowd'],
    highlights: [
      { kind: 'ratings', value: 356 },
      { kind: 'avg-rating', value: 7.2 },
      { kind: 'perfect-tens', value: 25 },
    ],
  },
  loyalist: {
    runnerUp: 'weekend-marathoner',
    rarity: 10,
    streak: 21,
    traits: ['streak-keeper'],
    highlights: [
      { kind: 'top-show-episodes', value: 101 },
      { kind: 'top-show-share', value: 30 },
      { kind: 'genre-share', value: 57 },
    ],
  },
  curator: {
    runnerUp: 'critic',
    rarity: 9,
    streak: 24,
    traits: ['hype-machine', 'app-hopper'],
    highlights: [
      { kind: 'movies', value: 42 },
      { kind: 'networks', value: 10 },
      { kind: 'perfect-tens', value: 31 },
    ],
  },
  wildcard: {
    runnerUp: null,
    rarity: 3,
    streak: 12,
    traits: ['globetrotter'],
    highlights: [
      { kind: 'personas-in-range', value: 10 },
      { kind: 'plays', value: 290 },
      { kind: 'streak-days', value: 12 },
    ],
  },
  'opening-act': {
    runnerUp: null,
    rarity: 21,
    streak: 3,
    traits: ['fresh-start'],
    highlights: [
      { kind: 'plays', value: 18 },
      { kind: 'streak-days', value: 3 },
    ],
  },
};

const ORDER = Object.keys(FIXTURES) as YirPersonaId[];

function monthlyPersonas(
  persona: YirPersonaId,
  runnerUp: YirPersonaId | null,
): YirPersonaResult['monthly'] {
  const alternate = runnerUp ??
    ORDER.at((ORDER.indexOf(persona) + 3) % ORDER.length) ??
    persona;
  const pattern = [persona, persona, alternate, persona, persona, alternate];

  if (persona === 'wildcard') {
    return ORDER.slice(0, 9).map((id, index) => ({
      month: index + 1,
      persona: id,
    }));
  }

  return Array.from({ length: 9 }, (_, index) => ({
    month: index + 1,
    persona: pattern.at(index % pattern.length) ?? persona,
  }));
}

function personaScores(
  persona: YirPersonaId,
  runnerUp: YirPersonaId | null,
): YirPersonaResult['scores'] {
  const flat = persona === 'wildcard' || persona === 'opening-act';

  return Object.fromEntries(
    ORDER.map((id, index) => {
      if (flat) return [id, 52 + ((index * 7) % 14)];
      if (id === persona) return [id, 96];
      if (id === runnerUp) return [id, 89];
      return [id, 20 + ((index * 17) % 50)];
    }),
  ) as YirPersonaResult['scores'];
}

type DummyYirPersonaResultProps = {
  persona: YirPersonaId;
  runnerUp?: YirPersonaId | null;
};

export function dummyYirPersonaResult(
  { persona, runnerUp }: DummyYirPersonaResultProps,
): YirPersonaResult {
  const fixture = FIXTURES[persona];
  const resolvedRunnerUp = runnerUp === undefined ? fixture.runnerUp : runnerUp;

  return {
    persona,
    runnerUp: resolvedRunnerUp,
    confidence: 'strong',
    rarity: fixture.rarity,
    cardNumber: ORDER.indexOf(persona) + 1,
    traits: fixture.traits,
    highlights: fixture.highlights,
    runnerUpHighlights: resolvedRunnerUp
      ? FIXTURES[resolvedRunnerUp].highlights
      : [],
    scores: personaScores(persona, resolvedRunnerUp),
    streak: {
      longest: fixture.streak,
      startedAt: new Date('2026-03-02T00:00:00Z'),
    },
    monthly: monthlyPersonas(persona, resolvedRunnerUp),
  };
}
