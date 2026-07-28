import { z } from 'zod';

export const RegisteredMemberCountSchema = z.object({
  // Authoritative at `anchoredAt`.
  total: z.number().int(),
  anchoredAt: z.number(),
  // Trailing mean of the last seven closed days: a measured rate, which is what
  // makes interpolating between polls honest.
  ratePerDay: z.number(),
});

export type RegisteredMemberCount = z.infer<typeof RegisteredMemberCountSchema>;
