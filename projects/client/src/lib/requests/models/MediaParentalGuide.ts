import { z } from 'zod';

const MediaParentalGuideVotesSchema = z.object({
  none: z.number(),
  mild: z.number(),
  moderate: z.number(),
  severe: z.number(),
});

const MediaParentalGuideCategorySchema = z.object({
  categoryId: z.string().nullish(),
  label: z.string(),
  severity: z.string(),
  severityLabel: z.string().nullish(),
  votes: MediaParentalGuideVotesSchema,
  totalVotes: z.number(),
});

export const MediaParentalGuideSchema = z.object({
  id: z.string(),
  title: z.string().nullish(),
  categories: z.record(MediaParentalGuideCategorySchema),
});

export type MediaParentalGuide = z.infer<typeof MediaParentalGuideSchema>;
