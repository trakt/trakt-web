import { z } from 'zod';
import { ImageUrlsSchema } from './ImageUrlsSchema.ts';

export type Job = string;

const baseSchema = z.object({
  name: z.string(),
  key: z.string(),
  episodeCount: z.number().optional(),
});

export const CrewMemberSchema = baseSchema.extend({
  jobs: z.array(z.string()),
});
export type CrewMember = z.infer<typeof CrewMemberSchema>;

export const CastMemberSchema = baseSchema.extend({
  characterName: z.string(),
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
