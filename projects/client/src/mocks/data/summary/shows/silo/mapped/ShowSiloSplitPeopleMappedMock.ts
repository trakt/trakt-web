import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import { ShowSiloPeopleMappedMock } from './ShowSiloPeopleMappedMock.ts';

const guestStars = ShowSiloPeopleMappedMock.cast.filter(
  (member) => member.key === 'sophie-thompson',
);

export const ShowSiloSplitPeopleMappedMock: MediaCrew = {
  ...ShowSiloPeopleMappedMock,
  cast: ShowSiloPeopleMappedMock.cast.filter((member) =>
    !guestStars.some((guest) => guest.key === member.key)
  ),
  guestStars,
};
