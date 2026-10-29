import z from 'zod';
import { VipTierTitleSchema } from './VipTierTitle.ts';

export const VipVeteranMemorySchema = z.object({
  title: VipTierTitleSchema.nullable(),
  anniversaryYear: z.number().nullable(),
  graceShownOn: z.string().nullable(),
});

export type VipVeteranMemory = z.infer<typeof VipVeteranMemorySchema>;
