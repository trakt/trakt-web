import { z } from 'zod';

export const SocialUserResponseSchema = z.object({
  username: z.string(),
  private: z.boolean().default(false),
  deleted: z.boolean().default(false),
  name: z.string().nullish().default(null),
  vip: z.boolean().nullish(),
  vip_ep: z.boolean().nullish(),
  director: z.boolean().nullish(),
  ids: z.object({
    slug: z.string().nullish(),
    trakt: z.number(),
  }),
  images: z.object({
    avatar: z.object({
      full: z.string().nullish(),
    }).default({ full: null }),
  }).default({ avatar: { full: null } }),
  location: z.string().nullish().default(null),
  about: z.string().nullish().default(null),
  vip_cover_image: z.string().nullish().default(null),
  joined_at: z.string().nullish().default(null),
}).passthrough();
