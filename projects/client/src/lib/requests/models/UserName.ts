import z from 'zod';

export const UserNameSchema = z.object({
  full: z.string(),
  first: z.string(),
  last: z.string(),
});

export type UserName = z.infer<typeof UserNameSchema>;
