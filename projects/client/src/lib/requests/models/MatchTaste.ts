import { z } from 'zod';

export const MatchTasteSchema = z.object({
  slug: z.string(),
  name: z.string(),
  label: z.string(),
});

export type MatchTaste = z.infer<typeof MatchTasteSchema>;
