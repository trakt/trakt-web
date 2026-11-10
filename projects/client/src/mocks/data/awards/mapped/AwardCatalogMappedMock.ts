import type { AwardCeremony } from '$lib/requests/models/AwardCeremony.ts';

export const AwardCatalogMappedMock: AwardCeremony[] = [
  {
    slug: 'oscars',
    name: 'Oscars',
    mediaTypes: ['movie'],
    awards: [
      { slug: 'oscars-best-actor', name: 'Best Actor' },
      { slug: 'oscars-best-picture', name: 'Best Picture' },
    ],
  },
  {
    slug: 'golden-globes',
    name: 'Golden Globes',
    mediaTypes: ['movie', 'show'],
    awards: [
      {
        slug: 'golden-globes-best-television-series-drama',
        name: 'Best Television Series - Drama',
      },
    ],
  },
  {
    slug: 'emmys',
    name: 'Emmys',
    mediaTypes: ['show'],
    awards: [
      {
        slug: 'emmys-outstanding-drama-series',
        name: 'Outstanding Drama Series',
      },
    ],
  },
];
