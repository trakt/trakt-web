import { z } from 'zod';
import { RealityTierSchema } from './RealityTier.ts';

export const RealityClaimLabelSchema = z.enum([
  'accurate',
  'compressed',
  'composite',
  'changed',
  'invented',
]);

export const RealityCharacterKindSchema = z.enum([
  'real',
  'composite',
  'invented',
]);

export const RealityCheckDetailSchema = z.object({
  breakdown: z.string(),
  claims: z.array(
    z.object({
      about: z.string().nullable(),
      onScreen: z.string(),
      documented: z.string(),
      label: RealityClaimLabelSchema,
      impact: z.enum(['major', 'minor']),
    }),
  ),
  characters: z.array(
    z.object({
      name: z.string(),
      kind: RealityCharacterKindSchema,
      note: z.string(),
    }),
  ),
  timeline: z.string(),
  leftOut: z.array(z.string()),
  sources: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
    }),
  ),
});

export const RealityCheckSchema = z.object({
  verdict: RealityTierSchema,
  story: RealityTierSchema,
  protagonists: z.array(
    z.object({
      name: z.string(),
      tier: RealityTierSchema,
    }),
  ),
  summary: z.string(),
  detail: RealityCheckDetailSchema.nullable(),
});

export type RealityCheck = z.infer<typeof RealityCheckSchema>;
export type RealityCheckDetail = z.infer<typeof RealityCheckDetailSchema>;
export type RealityClaim = RealityCheckDetail['claims'][number];
