import { z } from 'zod';
import { YirPersonaIdSchema } from './YirPersonaId.ts';

export const YirHighlightKindSchema = z.enum([
  'anime-episodes',
  'anime-share',
  'streak-days',
  'premiere-share',
  'premieres',
  'weekend-share',
  'binge-days',
  'plays-per-day',
  'catalog-share',
  'top-show-episodes',
  'apps',
  'shows',
  'networks',
  'checkin-share',
  'new-releases',
  'avg-runtime',
  'avg-vintage',
  'pre-2000',
  'ratings',
  'avg-rating',
  'perfect-tens',
  'top-show-share',
  'genre-share',
  'movies',
  'plays',
  'personas-in-range',
]);

export const YirTraitIdSchema = z.enum([
  'streak-keeper',
  'night-owl',
  'early-bird',
  'weekend-warrior',
  'time-traveler',
  'globetrotter',
  'social-butterfly',
  'automaton',
  'app-hopper',
  'silent-watcher',
  'hype-machine',
  'tough-crowd',
  'polariser',
  'live-checker',
  'doc-nerd',
  'horror-hound',
  'fresh-start',
]);

const YirHighlightSchema = z.object({
  kind: YirHighlightKindSchema,
  value: z.number(),
});

export const YirPersonaResultSchema = z.object({
  persona: YirPersonaIdSchema,
  runnerUp: YirPersonaIdSchema.nullish(),
  confidence: z.enum(['strong', 'leaning']),
  rarity: z.number(),
  cardNumber: z.number(),
  traits: YirTraitIdSchema.array(),
  highlights: YirHighlightSchema.array(),
  runnerUpHighlights: YirHighlightSchema.array(),
  scores: z.record(YirPersonaIdSchema, z.number()),
  streak: z.object({
    longest: z.number(),
    startedAt: z.coerce.date().nullable(),
  }),
  monthly: z.object({
    month: z.number(),
    persona: YirPersonaIdSchema,
  }).array(),
});

export type YirPersonaResult = z.infer<typeof YirPersonaResultSchema>;
export type YirHighlight = z.infer<typeof YirHighlightSchema>;
export type YirHighlightKind = z.infer<typeof YirHighlightKindSchema>;
export type YirTraitId = z.infer<typeof YirTraitIdSchema>;
