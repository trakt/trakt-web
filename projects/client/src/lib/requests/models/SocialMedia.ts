import { z } from 'zod';

export const socialMediaSchema = z.object({
  x: z.string().nullish(),
  instagram: z.string().nullish(),
  facebook: z.string().nullish(),
  wikipedia: z.string().nullish(),
});

export type SocialMedia = z.infer<typeof socialMediaSchema>;
