import { SmartListFiltersSchema } from './SmartListFilters.ts';
import { SmartListMediaTypeSchema } from './SmartListMediaType.ts';
import { SmartListSourceSchema } from './SmartListSource.ts';
import { z } from 'zod';

export const SmartListDraftSchema = z.object({
  source: SmartListSourceSchema,
  mediaType: SmartListMediaTypeSchema,
  filters: SmartListFiltersSchema,
  confidence: z.number(),
});

export type SmartListDraft = z.infer<typeof SmartListDraftSchema>;
