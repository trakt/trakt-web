import type { SeasonRecap } from '$lib/requests/models/SeasonRecap.ts';

export const SeasonRecapPublicMappedMock: SeasonRecap = {
  season: 1,
  summary:
    'In the first season of Severance, Mark Scout leads a team at Lumon Industries. When new hire Helly R. attempts to escape, the team begins to uncover the truth.',
  keyPoints: [
    "The MDR team discovers the 'Overtime Contingency'.",
    "Mark's 'innie' discovers that Ms. Casey is his deceased wife, Gemma.",
  ],
  lines: [
    {
      key: 'recap-line-0',
      text: "Mark's 'innie' is reverted to his 'outie' state.",
      people: [
        {
          key: 'person-417597-0',
          name: 'Adam Scott',
          character: 'Mark Scout',
          headshot:
            'https://media.trakt.tv/images/people/000/417/597/headshots/thumb/212d1d562f.jpg.webp',
        },
      ],
    },
    {
      key: 'recap-line-1',
      text: 'Dr. Strickland keeps infected children in stasis.',
      people: [
        {
          key: 'person-1-0',
          name: 'No Photo',
          character: null,
          headshot: null,
        },
      ],
    },
    {
      key: 'recap-line-2',
      text: 'Irving and Burt are no longer together.',
      people: [
        {
          key: 'person-11908-0',
          name: 'John Turturro',
          character: 'Irving Bailiff',
          headshot: null,
        },
        {
          key: 'person-412441-1',
          name: 'Christopher Walken',
          character: 'Burt Goodman',
          headshot: null,
        },
      ],
    },
    {
      key: 'recap-line-3',
      text: 'Harmony Cobel has been suspended by the board.',
      people: [],
    },
  ],
  attribution: 'https://en.wikipedia.org/wiki/Severance_(TV_series)',
  chapters: [],
  hasStory: false,
};
