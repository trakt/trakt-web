import { z } from 'zod';
import { SmartListFiltersSchema } from './SmartListFilters.ts';
import { SmartListMediaTypeSchema } from './SmartListMediaType.ts';
import { SmartListSourceSchema } from './SmartListSource.ts';

export const SmartListTemplateSchema = z.object({
  key: z.string(),
  id: z.string(),
  source: SmartListSourceSchema,
  mediaType: SmartListMediaTypeSchema,
  filters: SmartListFiltersSchema,
  personal: z.boolean(),
  total: z.number().nullable(),
  posters: z.string().array(),
});

export type SmartListTemplate = z.infer<typeof SmartListTemplateSchema>;
