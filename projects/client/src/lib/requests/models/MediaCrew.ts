import { z } from 'zod';
import { ImageUrlsSchema } from './ImageUrlsSchema.ts';

export type Job = string;

export const CrewMemberSchema = z.object({
  jobs: z.array(z.string()),
  name: z.string(),
  id: z.string(),
});
export type CrewMember = z.infer<typeof CrewMemberSchema>;

export const CastMemberSchema = z.object({
  name: z.string(),
  characterName: z.string(),
  id: z.string(),
  headshot: z.object({
    url: ImageUrlsSchema,
  }),
});
export type CastMember = z.infer<typeof CastMemberSchema>;

export const MediaCrewSchema = z.object({
  directors: z.array(CrewMemberSchema),
  writers: z.array(CrewMemberSchema),
  creators: z.array(CrewMemberSchema),
  cast: z.array(CastMemberSchema),
});
export type MediaCrew = z.infer<typeof MediaCrewSchema>;
