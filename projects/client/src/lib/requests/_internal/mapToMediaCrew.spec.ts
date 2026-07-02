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
      guest_stars: [
        {
          character: 'Guest Role',
          characters: ['Guest Role'],
          person: {
            name: 'Guest Actor',
            ids: { slug: 'guest-actor' },
            images: {},
          },
        },
      ],
    } as unknown as PeopleResponse;
    const crew = mapToMediaCrew(response);

    expect(crew.cast).toMatchObject([
      {
        characterName: 'Primary Role',
        characters: ['Primary Role', 'Secondary Role'],
      },
      {
        characterName: '',
      },
    ]);
    expect(crew.guestStars).toMatchObject([
      {
        characterName: 'Guest Role',
        key: 'guest-actor',
        name: 'Guest Actor',
      },
    ]);
  });
});
