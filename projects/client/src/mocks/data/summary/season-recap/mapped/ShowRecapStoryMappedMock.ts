import type { ShowRecapStory } from '$lib/requests/models/ShowRecapStory.ts';
import { SeasonRecapPublicMappedMock } from './SeasonRecapPublicMappedMock.ts';

export const ShowRecapStoryMappedMock: ShowRecapStory = {
  checkpoint: 2,
  segments: [
    { season: 1, text: 'Mark Scout leads a team at Lumon Industries.' },
    {
      season: 2,
      text: 'The team returns. See [Lumon](/shows/severance).',
    },
  ],
  lines: SeasonRecapPublicMappedMock.lines,
};
