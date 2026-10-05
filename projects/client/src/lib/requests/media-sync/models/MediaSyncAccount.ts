import z from 'zod';

export const MediaSyncAccountSchema = z.object({
  accountId: z.string(),
  name: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  owner: z.boolean(),
  selected: z.boolean(),
});

export type MediaSyncAccount = z.infer<typeof MediaSyncAccountSchema>;
