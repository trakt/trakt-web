import { z } from 'zod';

export const ListIdSchema = z.number();

export type ListId = z.infer<typeof ListIdSchema>;
