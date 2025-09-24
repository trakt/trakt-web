import z from 'zod';

export const PostCreditsSchema = z.enum(['during', 'after']);

export type PostCredits = z.infer<typeof PostCreditsSchema>;
