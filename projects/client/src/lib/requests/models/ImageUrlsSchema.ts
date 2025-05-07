import { z } from 'zod';
import { HttpsUrlSchema } from './HttpsUrlSchema.ts';

export const ImageUrlsSchema = z.object({
  medium: HttpsUrlSchema,
  thumb: HttpsUrlSchema,
});
