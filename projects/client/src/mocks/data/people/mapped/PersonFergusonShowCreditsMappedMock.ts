import type { MediaCredits } from '$lib/requests/models/MediaCredits.ts';
import { ShowSiloMappedMock } from '../../summary/shows/silo/mapped/ShowSiloMappedMock.ts';

export const PersonFergusonShowCreditsMappedMock: MediaCredits = new Map([
  ['acting', [{
    type: 'cast',
    media: ShowSiloMappedMock,
    key: ShowSiloMappedMock.key,
    episodeCount: 20,
    character: 'Juliette Nichols',
  }]],
  ['production', [{
    type: 'crew',
    media: ShowSiloMappedMock,
    key: ShowSiloMappedMock.key,
    episodeCount: 20,
    job: 'Executive Producer',
  }]],
]);
