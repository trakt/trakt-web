import z from 'zod';

export const VipVeteranSchema = z.object({
  since: z.date(),
  years: z.number(),
  tier: z.number(),
  graceEndsAt: z.date().nullish(),
});

export type VipVeteran = z.infer<typeof VipVeteranSchema>;
