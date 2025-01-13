import type { Job } from '@trakt/api';

export type CrewMember = {
  jobs: Job[];
  name: string;
};

export type CastMember = {
  name: string;
  characterName: string;
  id: string;
  headShotUrl: HttpsUrl;
};

export type MediaCrew = {
  directors: CrewMember[];
  writers: CrewMember[];
  cast: CastMember[];
};
