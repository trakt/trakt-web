import type { AwardEntry } from '$lib/requests/models/AwardEntry.ts';

export const MoviePerfectDaysAwardsMappedMock: AwardEntry[] = [
  {
    key: 'oscars-oscars-best-international-feature-film-2024-',
    category: 'Best International Feature Film',
    ceremony: {
      key: 'oscars',
      slug: 'oscars',
      name: 'Academy Awards',
      edition: 96,
      nominationsAt: new Date('2024-01-23T00:00'),
      heldAt: new Date('2024-03-10T00:00'),
    },
    year: 2024,
    won: false,
  },
];
