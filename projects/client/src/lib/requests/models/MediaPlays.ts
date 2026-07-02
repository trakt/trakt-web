import { z } from 'zod';
import { WatchedPlaySchema } from './WatchedPlay.ts';

export const MediaPlaysSchema = z.object({
  id: z.number(),
  plays: z.array(WatchedPlaySchema),
});

export type MediaPlays = z.infer<typeof MediaPlaysSchema>;
