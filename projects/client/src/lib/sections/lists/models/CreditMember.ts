import type { CrewPositions } from '$lib/requests/models/CrewPosition.ts';
import type { CastMember } from '$lib/requests/models/MediaCrew.ts';

export type CreditMember = {
  key: string;
  name: string;
  description: string;
  descriptionItems?: string[];
  headshot?: CastMember['headshot'];
  episodeCount?: number;
  positions?: CrewPositions;
};
