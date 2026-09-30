import { z } from 'zod';

export const EmailSettingsResponseSchema = z.object({
  notifications: z.boolean(),
  recaps: z.boolean(),
  marketing: z.boolean(),
});

export type EmailSettingsResponse = z.infer<typeof EmailSettingsResponseSchema>;
