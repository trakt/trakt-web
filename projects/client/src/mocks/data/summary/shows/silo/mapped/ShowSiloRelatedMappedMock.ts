import type { RelatedShow } from '$lib/requests/queries/shows/showRelatedQuery';
import { ShowDevsMappedMock } from '../../devs/ShowDevsMappedMock';

export const ShowSiloRelatedMappedMock: RelatedShow[] = [
  {
    ...ShowDevsMappedMock,
    'episode': {
      'count': 8,
    },
  },
];
