import { z } from 'zod';

export const NoteTypeSchema = z.enum(['favorites', 'note']);

export type NoteType = z.infer<typeof NoteTypeSchema>;
