import { z } from 'zod';

export const EmailSettingsSchema = z.object({
  hasNotifications: z.boolean(),
  hasMarketing: z.boolean(),
});

export type EmailSettings = z.infer<typeof EmailSettingsSchema>;
