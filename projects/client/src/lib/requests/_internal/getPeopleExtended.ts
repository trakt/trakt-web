export function getPeopleExtended(guestStars: boolean) {
  return (guestStars ? 'images,guest_stars' : 'images') as 'images';
}
