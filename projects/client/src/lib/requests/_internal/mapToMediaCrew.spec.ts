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

  describe('character portraits', () => {
    const response = {
      cast: [
        {
          character: 'Juliette Nichols',
          person: {
            name: 'Rebecca Ferguson',
            ids: { trakt: 447271, slug: 'rebecca-ferguson' },
          },
        },
      ],
      guest_stars: [
        {
          character: 'Guest Role',
          person: {
            name: 'Guest Actor',
            ids: { trakt: 9, slug: 'guest-actor' },
          },
        },
      ],
      crew: {
        directing: [
          {
            jobs: ['Director'],
            person: {
              name: 'Director One',
              ids: { trakt: 7, slug: 'director-one' },
            },
          },
        ],
      },
    } as unknown as PeopleResponse;

    const portrait = (id: string) => ({
      url: {
        medium: `https://media.trakt.tv/portraits/${id}/medium/portrait.webp?verify=1794787200-mac`,
        thumb: `https://media.trakt.tv/portraits/${id}/thumb/portrait.webp?verify=1794787200-mac`,
      },
    });

    const headshot = (id: number) => ({
      url: {
        medium: `https://media.trakt.tv/people/${id}/medium/headshot.webp`,
        thumb: `https://media.trakt.tv/people/${id}/thumb/headshot.webp`,
      },
    });

    it('should use the show character portrait for the cast', () => {
      const crew = mapToMediaCrew(response, {
        media: 'show',
        id: 1390,
        token: '1794787200-mac',
      });

      expect(crew.cast.at(0)?.headshot).toEqual(portrait('show-1390-447271'));
      expect(crew.guestStars.at(0)?.headshot).toEqual(portrait('show-1390-9'));
    });

    it('should use the movie character portrait for the cast', () => {
      const crew = mapToMediaCrew(response, {
        media: 'movie',
        id: 120,
        token: '1794787200-mac',
      });

      expect(crew.cast.at(0)?.headshot).toEqual(portrait('movie-120-447271'));
    });

    it('should use the season character portrait for the season cast', () => {
      const crew = mapToMediaCrew(response, {
        media: 'show',
        id: 1390,
        season: 2,
        token: '1794787200-mac',
      });

      expect(crew.cast.at(0)?.headshot).toEqual(
        portrait('show-1390-s2-447271'),
      );
      expect(crew.guestStars.at(0)?.headshot).toEqual(
        portrait('show-1390-s2-9'),
      );
    });

    it('should keep specials (season 0) on the season character portrait', () => {
      const crew = mapToMediaCrew(response, {
        media: 'show',
        id: 1390,
        season: 0,
        token: '1794787200-mac',
      });

      expect(crew.cast.at(0)?.headshot).toEqual(
        portrait('show-1390-s0-447271'),
      );
    });

    it('should use the person headshot without a portrait target', () => {
      const crew = mapToMediaCrew(response);

      expect(crew.cast.at(0)?.headshot).toEqual(headshot(447271));
      expect(JSON.stringify(crew)).not.toContain('/portraits/');
    });

    it('should keep the crew without a character portrait', () => {
      const crew = mapToMediaCrew(response, {
        media: 'show',
        id: 1390,
        token: '1794787200-mac',
      });

      expect(crew.directors.at(0)).not.toHaveProperty('headshot');
      expect(JSON.stringify(crew.directors)).not.toContain('/portraits/');
    });
  });
});
