import { VipVeteranTitleSchema } from '$lib/requests/models/VipVeteranTitle.ts';
import z from 'zod';

export const VipVeteranMemorySchema = z.object({
  title: VipVeteranTitleSchema.nullable(),
  anniversaryYear: z.number().nullable(),
  graceShownOn: z.string().nullable(),
});

export type VipVeteranMemory = z.infer<typeof VipVeteranMemorySchema>;
