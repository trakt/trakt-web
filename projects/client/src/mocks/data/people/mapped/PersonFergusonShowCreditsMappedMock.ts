import type { MediaCredits } from '$lib/requests/models/MediaCredits.ts';
import { ShowSiloMappedMock } from '../../summary/shows/silo/mapped/ShowSiloMappedMock.ts';

export const PersonFergusonShowCreditsMappedMock: MediaCredits = new Map([
  ['acting', [{
    type: 'cast',
    media: ShowSiloMappedMock,
    key: ShowSiloMappedMock.key,
    character: 'Juliette Nichols',
  }]],
  ['production', [{
    type: 'crew',
    media: ShowSiloMappedMock,
    key: ShowSiloMappedMock.key,
    job: 'Executive Producer',
  }]],
]);
