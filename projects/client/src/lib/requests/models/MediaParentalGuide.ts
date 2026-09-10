import { z } from 'zod';

const signals = z.number().int().nonnegative();

const MediaParentalGuideSignalsSchema = z.object({
  none: signals,
  mild: signals,
  moderate: signals,
  severe: signals,
});

const MediaParentalGuideCategorySchema = z.object({
  category: z.enum([
    'NUDITY',
    'VIOLENCE',
    'PROFANITY',
    'ALCOHOL',
    'FRIGHTENING',
  ]),
  severity: z.enum(['NONE', 'MILD', 'MODERATE', 'SEVERE']),
  signals: MediaParentalGuideSignalsSchema,
});

export const MediaParentalGuideSchema = z.object({
  guide: z.array(MediaParentalGuideCategorySchema),
});

export type MediaParentalGuide = z.infer<typeof MediaParentalGuideSchema>;
