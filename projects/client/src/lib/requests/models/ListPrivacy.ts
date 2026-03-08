import { z } from 'zod';

export const ListPrivacySchema = z.enum([
  'public',
  'private',
  'link',
  'friends',
]);

export type ListPrivacy = z.infer<typeof ListPrivacySchema>;
