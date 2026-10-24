import type { RealityCheckResponse } from '$lib/requests/models/RealityCheckResponse.ts';
import { RealityCheckPublicResponseMock } from './RealityCheckPublicResponseMock.ts';

export const RealityCheckVipResponseMock: RealityCheckResponse = {
  ...RealityCheckPublicResponseMock,
  breakdown:
    "### Fictionalized Motivations\nThe film invents Mark's motivation as a way to get girls after a breakup.\n\n### Sean Parker\n[Sean Parker](https://app.trakt.tv/people/sean-parker) is portrayed as a charismatic and manipulative figure.",
  claims: [
    {
      about: 'Story',
      label: 'invented',
      impact: 'major',
      onScreen: 'Mark creates Facemash after being dumped by Erica Albright.',
      documented: 'Erica Albright is a fictional character.',
    },
    {
      about: 'Story',
      label: 'compressed',
      impact: 'minor',
      onScreen: 'Two lawsuits play out in one deposition.',
      documented: 'There were two separate cases, settled out of court.',
    },
    {
      about: 'Eduardo Saverin',
      label: 'accurate',
      impact: 'major',
      onScreen: 'Eduardo freezes the company bank account.',
      documented: 'Saverin did freeze the account.',
    },
  ],
  characters: [
    {
      name: 'Mark Zuckerberg',
      kind: 'real',
      note: 'Portrayed as a socially awkward genius, which he disputes.',
    },
    {
      name: 'Erica Albright',
      kind: 'invented',
      note: 'A fictional composite of several relationships.',
    },
  ],
  timeline: 'The film uses the two lawsuits as a narrative framework.',
  leftOut: ['Co-founder Dustin Moskovitz.'],
};
