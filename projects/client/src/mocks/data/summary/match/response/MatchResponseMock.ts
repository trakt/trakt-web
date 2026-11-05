import type { MatchResponse } from '$lib/requests/models/MatchResponse.ts';

export const MatchResponseMock: MatchResponse = {
  match: 91,
  taste: [
    { slug: 'world-war-ii', name: 'world war ii', label: 'World War II' },
    { slug: 'biopic', name: 'biopic', label: 'Biopic' },
    {
      slug: 'top-secret-project',
      name: 'top secret project',
      label: 'Top Secret Project',
    },
  ],
};
