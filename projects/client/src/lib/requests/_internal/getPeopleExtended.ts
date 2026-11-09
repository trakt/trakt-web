export function getPeopleExtended(guestStars: boolean) {
  return guestStars ? ('guest_stars' as const) : undefined;
}
