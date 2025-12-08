import { z } from 'zod';

const ListPrivacySchema = z.enum(['public', 'private']);

export type ListPrivacy = z.infer<typeof ListPrivacySchema>;
