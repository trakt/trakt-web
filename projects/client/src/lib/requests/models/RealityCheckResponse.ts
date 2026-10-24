import { z } from 'zod';
import { RealityTierSchema } from './RealityTier.ts';

const ClaimLabelSchema = z.enum([
  'accurate',
  'compressed',
  'composite',
  'changed',
  'invented',
]);

const CharacterKindSchema = z.enum(['real', 'composite', 'invented']);

export const RealityCheckResponseSchema = z.object({
  applicable: z.boolean(),
  verdict: RealityTierSchema,
  story: RealityTierSchema,
  protagonists: z.array(
    z.object({
      name: z.string(),
      tier: RealityTierSchema,
    }),
  ),
  summary: z.string(),
  breakdown: z.string().optional(),
  claims: z
    .array(
      z.object({
        about: z.string(),
        onScreen: z.string(),
        documented: z.string(),
        label: ClaimLabelSchema,
        impact: z.enum(['major', 'minor']),
      }),
    )
    .optional(),
  characters: z
    .array(
      z.object({
        name: z.string(),
        kind: CharacterKindSchema,
        note: z.string(),
      }),
    )
    .optional(),
  timeline: z.string().optional(),
  leftOut: z.array(z.string()).optional(),
  sources: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
      }),
    )
    .optional(),
});

export type RealityCheckResponse = z.infer<typeof RealityCheckResponseSchema>;
