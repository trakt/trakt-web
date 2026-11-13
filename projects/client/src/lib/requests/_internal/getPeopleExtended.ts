export function getPeopleExtended(guestStars: boolean) {
  return guestStars ? ('images,guest_stars' as const) : ('images' as const);
}
