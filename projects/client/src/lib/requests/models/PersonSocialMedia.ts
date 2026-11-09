import { z } from 'zod';
import { socialMediaSchema } from './SocialMedia.ts';

export const personSocialMediaSchema = socialMediaSchema.extend({
  tiktok: z.string().nullish(),
  youtube: z.string().nullish(),
  wikidata: z.string().nullish(),
  wikipediaLanguage: z.string().nullish(),
});

export type PersonSocialMedia = z.infer<typeof personSocialMediaSchema>;
