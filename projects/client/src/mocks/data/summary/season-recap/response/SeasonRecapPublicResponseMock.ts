import type { SeasonRecapResponse } from '$lib/requests/models/SeasonRecapResponse.ts';

export const SeasonRecapPublicResponseMock: SeasonRecapResponse = {
  season: 1,
  recap:
    'In the first season of Severance, Mark Scout leads a team at Lumon Industries. When new hire Helly R. attempts to escape, the team begins to uncover the truth.',
  keyPoints: [
    "The MDR team discovers the 'Overtime Contingency'.",
    "Mark's 'innie' discovers that Ms. Casey is his deceased wife, Gemma.",
  ],
  whereThingsStand: [
    {
      text: "Mark's 'innie' is reverted to his 'outie' state.",
      people: [
        {
          character: 'Mark Scout',
          person: {
            ids: { trakt: 417597, slug: 'adam-scott' },
            name: 'Adam Scott',
            images: {
              headshot: [
                'media.trakt.tv/images/people/000/417/597/headshots/medium/212d1d562f.jpg.webp',
              ],
            },
          },
        },
      ],
    },
    {
      text: 'Dr. Strickland keeps infected children in stasis.',
      people: [
        {
          character: null,
          person: {
            ids: { trakt: 1, slug: 'no-photo-actor' },
            name: 'No Photo',
            images: { headshot: [] },
          },
        },
      ],
    },
    {
      text: 'Irving and Burt are no longer together.',
      people: [
        {
          character: 'Irving Bailiff',
          person: {
            ids: { trakt: 11908, slug: 'john-turturro' },
            name: 'John Turturro',
            images: { headshot: [] },
          },
        },
        {
          character: 'Burt Goodman',
          person: {
            ids: { trakt: 412441, slug: 'christopher-walken' },
            name: 'Christopher Walken',
            images: null,
          },
        },
      ],
    },
    {
      text: 'Harmony Cobel has been suspended by the board.',
      people: [],
    },
  ],
  attribution: 'https://en.wikipedia.org/wiki/Severance_(TV_series)',
};
