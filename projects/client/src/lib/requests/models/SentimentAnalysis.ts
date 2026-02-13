import { z } from 'zod';

const prosAndConsSchema = z.object({
  pros: z.array(z.string()),
  cons: z.array(z.string()),
});

export const SentimentAnalysisSchema = z.object({
  analysis: z.string(),
  highlight: z.string(),
  aspect: prosAndConsSchema,
});

export type SentimentAnalysis = z.infer<typeof SentimentAnalysisSchema>;
