import { z } from 'zod';

export const AwardsOpenSourceSchema = z.enum([
  'chip',
  'section',
  'timeline',
  'link',
]);
export type AwardsOpenSource = z.infer<typeof AwardsOpenSourceSchema>;
