import { z } from 'zod';

export const HttpsUrlSchema = z.custom<HttpsUrl>((val) =>
  typeof val === 'string' && val.startsWith('https://')
);
