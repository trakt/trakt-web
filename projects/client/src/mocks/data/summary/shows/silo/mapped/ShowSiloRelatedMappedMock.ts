import type { RelatedShow } from '$lib/requests/queries/shows/showRelatedQuery.ts';
import { ShowDevsMappedMock } from '../../devs/ShowDevsMappedMock.ts';

export const ShowSiloRelatedMappedMock: RelatedShow[] = [
  {
    ...ShowDevsMappedMock,
    'episode': {
      'count': 8,
    },
  },
];
