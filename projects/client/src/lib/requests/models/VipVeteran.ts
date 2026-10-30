import { VipVeteranTitleSchema } from '$lib/requests/models/VipVeteranTitle.ts';
import z from 'zod';

export const VipVeteranSchema = z.object({
  since: z.date(),
  years: z.number(),
  tier: z.number(),
  title: VipVeteranTitleSchema.nullish(),
  graceEndsAt: z.date().nullish(),
});

export type VipVeteran = z.infer<typeof VipVeteranSchema>;
