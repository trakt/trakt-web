import type { Job } from '$lib/api.ts';

export type CrewMember = {
  job: Job;
  name: string;
};

export type MediaCrew = {
  directors: CrewMember[];
  writers: CrewMember[];
};
