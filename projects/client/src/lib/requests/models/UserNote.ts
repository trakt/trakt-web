import { z } from 'zod';
import { NoteTypeSchema } from './NoteType.ts';

export const UserNoteSchema = z.object({
  id: z.number(),
  notes: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  type: NoteTypeSchema,
});

export type UserNote = z.infer<typeof UserNoteSchema>;
