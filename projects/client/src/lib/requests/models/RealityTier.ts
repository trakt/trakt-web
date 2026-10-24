import { z } from 'zod';

export const RealityTierSchema = z.enum([
  'faithful',
  'mostly_true',
  'loose',
  'in_name_only',
  'unclear',
]);

export type RealityTier = z.infer<typeof RealityTierSchema>;
