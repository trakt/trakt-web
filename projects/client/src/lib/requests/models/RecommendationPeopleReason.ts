import { z } from 'zod';
import { MovieEntrySchema } from './MovieEntry.ts';
import { PersonSummarySchema } from './PersonSummary.ts';
import { ShowEntrySchema } from './ShowEntry.ts';

export const RecommendationPeopleReasonSchema = z.object({
  person: PersonSummarySchema,
  role: z.enum(['directing', 'making', 'acting']),
  watchedRoles: z.array(z.enum(['directing', 'making', 'acting'])),
  watchedCount: z.number(),
  titles: z.array(
    z.union([
      z.object({ mediaType: z.literal('movie'), media: MovieEntrySchema }),
      z.object({ mediaType: z.literal('show'), media: ShowEntrySchema }),
    ]),
  ),
});

export type RecommendationPeopleReason = z.infer<
  typeof RecommendationPeopleReasonSchema
>;
