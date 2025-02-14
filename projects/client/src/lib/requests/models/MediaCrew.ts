import { jobOptionSchema } from '@trakt/api';
import { z } from 'zod';

const JobSchema = jobOptionSchema;
export type Job = z.output<typeof JobSchema>;

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
  headShotUrl: z.string().url(),
});
export type CastMember = z.infer<typeof CastMemberSchema>;

export const MediaCrewSchema = z.object({
  directors: z.array(CrewMemberSchema),
  writers: z.array(CrewMemberSchema),
  cast: z.array(CastMemberSchema),
});
export type MediaCrew = z.infer<typeof MediaCrewSchema>;
