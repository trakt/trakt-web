import { z } from 'zod';
import { NoteTypeSchema } from './NoteType.ts';

export const UserNoteResponseSchema = z.object({
  id: z.number(),
  notes: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  type: NoteTypeSchema,
});

export type UserNoteResponse = z.infer<typeof UserNoteResponseSchema>;
