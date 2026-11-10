import { z } from 'zod';
import { MediaTypeSchema } from './MediaType.ts';

export const AwardCeremonySchema = z.object({
  slug: z.string(),
  name: z.string(),
  mediaTypes: MediaTypeSchema.array(),
  awards: z.object({ slug: z.string(), name: z.string() }).array(),
});

export type AwardCeremony = z.infer<typeof AwardCeremonySchema>;
