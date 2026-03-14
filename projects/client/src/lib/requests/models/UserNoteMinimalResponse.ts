import { z } from 'zod';
import { MediaTypeSchema } from './MediaType.ts';
import { NoteTypeSchema } from './NoteType.ts';

export const UserNoteMinimalResponseSchema = z.object({
  type: MediaTypeSchema,
  id: z.number(),
  note: NoteTypeSchema,
});

export type UserNoteMinimalResponse = z.infer<
  typeof UserNoteMinimalResponseSchema
>;
