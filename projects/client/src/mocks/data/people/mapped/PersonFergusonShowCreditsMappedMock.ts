import type { MediaCredits } from '$lib/requests/models/MediaCredits.ts';
import { ShowSiloMappedMock } from '../../summary/shows/silo/mapped/ShowSiloMappedMock.ts';

export const PersonFergusonShowCreditsMappedMock: MediaCredits = new Map([
  ['acting', [ShowSiloMappedMock]],
  ['production', [ShowSiloMappedMock]],
]);
