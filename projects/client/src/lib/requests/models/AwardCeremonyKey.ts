import { z } from 'zod';

export const AwardCeremonyKeySchema = z.enum([
  'oscars',
  'golden-globes',
  'emmys',
  'emmys-creative-arts',
  'cannes',
  'venice',
  'berlin',
  'other',
]);
export type AwardCeremonyKey = z.infer<typeof AwardCeremonyKeySchema>;
