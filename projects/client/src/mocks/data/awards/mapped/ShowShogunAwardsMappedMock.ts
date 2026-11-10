import type { AwardEntry } from '$lib/requests/models/AwardEntry.ts';

export const ShowShogunAwardsMappedMock: AwardEntry[] = [
  {
    key: 'emmys-emmys-outstanding-drama-series-2024-',
    category: 'Outstanding Drama Series',
    ceremony: {
      key: 'emmys',
      slug: 'emmys',
      name: 'Primetime Emmys',
      edition: 76,
      nominationsAt: new Date('2024-07-17T00:00'),
      heldAt: new Date('2024-09-15T00:00'),
    },
    year: 2024,
    won: true,
  },
];
