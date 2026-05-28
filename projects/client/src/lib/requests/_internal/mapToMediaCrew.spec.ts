import type { PeopleResponse } from '@trakt/api';
import { describe, expect, it } from 'vitest';
import { mapToMediaCrew } from './mapToMediaCrew.ts';

describe('mapToMediaCrew', () => {
  it('guards nullable cast character fields from the API', () => {
    const response = {
      cast: [
        {
          character: null,
          characters: ['Primary Role', 'Secondary Role'],
          person: {
            name: 'Actor One',
            ids: { slug: 'actor-one' },
            images: {},
          },
        },
        {
          character: null,
          characters: null,
          person: {
            name: 'Actor Two',
            ids: { slug: 'actor-two' },
            images: {},
          },
        },
      ],
    } as unknown as PeopleResponse;

    expect(mapToMediaCrew(response).cast).toMatchObject([
      {
        characterName: 'Primary Role',
        characters: ['Primary Role', 'Secondary Role'],
      },
      {
        characterName: '',
      },
    ]);
  });
});
