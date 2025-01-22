import { z } from 'zod';

export const ActiveWatcherSchema = z.object({
  username: z.string(),
  private: z.boolean(),
  name: z.string(),
  isVip: z.boolean(),
  slug: z.string(),
});

export type ActiveWatcher = z.infer<typeof ActiveWatcherSchema>;
