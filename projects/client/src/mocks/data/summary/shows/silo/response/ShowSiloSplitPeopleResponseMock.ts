import { ShowSiloPeopleResponseMock } from './ShowSiloPeopleResponseMock.ts';

const guestStars = (ShowSiloPeopleResponseMock.cast ?? []).filter(
  (member) => member.person.ids.slug === 'sophie-thompson',
);

export const ShowSiloSplitPeopleResponseMock = {
  ...ShowSiloPeopleResponseMock,
  cast: (ShowSiloPeopleResponseMock.cast ?? []).filter((member) =>
    !guestStars.some((guest) =>
      guest.person.ids.slug === member.person.ids.slug
    )
  ),
  guest_stars: guestStars,
};
