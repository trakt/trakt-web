import { z } from 'zod';

export const RegisteredMemberCountSchema = z.object({
  total: z.number().int(),
});

export type RegisteredMemberCount = z.infer<typeof RegisteredMemberCountSchema>;
