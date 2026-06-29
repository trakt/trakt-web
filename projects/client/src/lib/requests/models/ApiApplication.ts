import { z } from 'zod';

export const ApiApplicationPermissionsSchema = z.object({
  canScrobble: z.boolean(),
  canCheckin: z.boolean(),
  canCreateAccounts: z.boolean(),
});

export type ApiApplicationPermissions = z.infer<
  typeof ApiApplicationPermissionsSchema
>;

export const ApiApplicationSchema = z.object({
  id: z.number(),
  key: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  clientId: z.string(),
  clientSecret: z.string(),
  redirectUris: z.array(z.string()),
  origins: z.array(z.string()),
  isApproved: z.boolean(),
  approvedAt: z.date().nullish(),
  scopes: z.array(z.string()),
  permissions: ApiApplicationPermissionsSchema,
  createdAt: z.date(),
});

export type ApiApplication = z.infer<typeof ApiApplicationSchema>;
