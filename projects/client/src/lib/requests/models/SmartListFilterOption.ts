import { z } from 'zod';

export const SmartListFilterOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export type SmartListFilterOption = z.infer<typeof SmartListFilterOptionSchema>;
