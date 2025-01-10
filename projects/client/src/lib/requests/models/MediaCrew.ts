import type { Job } from '@trakt/api';

export type CrewMember = {
  jobs: Job[];
  name: string;
};

export type MediaCrew = {
  directors: CrewMember[];
  writers: CrewMember[];
};
