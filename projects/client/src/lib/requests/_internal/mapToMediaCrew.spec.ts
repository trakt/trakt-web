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

  it('should use the character image as the cast headshot', () => {
    const response = {
      cast: [
        {
          character: 'Juliette Nichols',
          character_image:
            'media.trakt.tv/characters/180770-447271/medium/headshot.webp',
          person: {
            name: 'Rebecca Ferguson',
            ids: { slug: 'rebecca-ferguson', trakt: 447271 },
          },
        },
      ],
    } as unknown as PeopleResponse;

    expect(mapToMediaCrew(response).cast.at(0)?.headshot.url).toEqual({
      medium:
        'https://media.trakt.tv/characters/180770-447271/medium/headshot.webp',
      thumb:
        'https://media.trakt.tv/characters/180770-447271/thumb/headshot.webp',
    });
  });

  it('should fall back to the person headshot without a character image', () => {
    const response = {
      cast: [
        {
          character: 'Robert Sims',
          character_image: null,
          person: {
            name: 'Common',
            ids: { slug: 'common', trakt: 412328 },
          },
        },
      ],
    } as unknown as PeopleResponse;

    expect(mapToMediaCrew(response).cast.at(0)?.headshot.url.thumb).toBe(
      'https://media.trakt.tv/people/412328/thumb/headshot.webp',
    );
  });
});
