import { z } from 'zod';

export const permissionSchema = z.enum([
  'comment',
  'like',
  'follow',
]);

export type Permission = z.infer<typeof permissionSchema>;
