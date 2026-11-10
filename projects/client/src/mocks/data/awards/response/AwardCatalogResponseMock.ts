import type { AwardCatalogResponse } from '@trakt/api';

export const AwardCatalogResponseMock: AwardCatalogResponse[] = [
  {
    slug: 'oscars',
    name: 'Oscars',
    media_types: ['movie'],
    awards: [
      { slug: 'oscars-best-actor', name: 'Best Actor', kind: 'person' },
      { slug: 'oscars-best-picture', name: 'Best Picture', kind: 'title' },
    ],
  },
  {
    slug: 'golden-globes',
    name: 'Golden Globes',
    media_types: ['movie', 'show'],
    awards: [
      {
        slug: 'golden-globes-best-television-series-drama',
        name: 'Best Television Series - Drama',
        kind: 'title',
      },
    ],
  },
  {
    slug: 'emmys',
    name: 'Emmys',
    media_types: ['show'],
    awards: [
      {
        slug: 'emmys-outstanding-drama-series',
        name: 'Outstanding Drama Series',
        kind: 'title',
      },
    ],
  },
];
