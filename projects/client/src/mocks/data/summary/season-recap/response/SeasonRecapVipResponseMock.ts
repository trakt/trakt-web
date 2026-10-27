import type { SeasonRecapResponse } from '$lib/requests/models/SeasonRecapResponse.ts';
import { SeasonRecapPublicResponseMock } from './SeasonRecapPublicResponseMock.ts';

export const SeasonRecapVipResponseMock: SeasonRecapResponse = {
  ...SeasonRecapPublicResponseMock,
  expanded:
    '## The Severed Floor\nThe season introduces [severance](https://app.trakt.tv/shows/severance).\n\n## The Overtime Contingency\nThe MDR team plans to expose Lumon.\n\n## Empty chapter\n',
  storySegment: 'Mark Scout leads a team at Lumon Industries.',
};
