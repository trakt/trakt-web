import type { SeasonRecap } from '$lib/requests/models/SeasonRecap.ts';
import { SeasonRecapPublicMappedMock } from './SeasonRecapPublicMappedMock.ts';

export const SeasonRecapVipMappedMock: SeasonRecap = {
  ...SeasonRecapPublicMappedMock,
  chapters: [
    {
      key: 'recap-chapter-0',
      title: 'The Severed Floor',
      body: 'The season introduces [severance](/shows/severance).',
    },
    {
      key: 'recap-chapter-1',
      title: 'The Overtime Contingency',
      body: 'The MDR team plans to expose Lumon.',
    },
  ],
  hasStory: true,
};
