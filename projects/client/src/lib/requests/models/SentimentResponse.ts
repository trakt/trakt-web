import { z } from 'zod';

const AspectItemSchema = z.object({
  theme: z.string(),
  confidence: z.number(),
});

export const SentimentResponseSchema = z.object({
  aspect: z.object({
    pros: z.array(AspectItemSchema),
    cons: z.array(AspectItemSchema),
  }),
  sentiment: z.object({
    overall: z.enum(['positive', 'negative', 'mixed']),
    score: z.number(),
    keywords: z.object({
      pros: z.array(z.string()),
      cons: z.array(z.string()),
    }),
  }),
  analysis: z.string().optional(),
  highlight: z.string().optional(),
});

export type SentimentResponse = z.infer<
  typeof SentimentResponseSchema
>;
