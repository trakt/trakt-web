import type { WatchNowServices } from '$lib/requests/models/WatchNowServices.ts';

type FindFavoriteWatchNowServiceProps = {
  services: WatchNowServices;
  favorites: string[];
  countryCode: string;
};

export function findFavoriteWatchNowService({
  services,
  favorites,
  countryCode,
}: FindFavoriteWatchNowServiceProps) {
  const favoriteSubscriptionMatch = services
    .streaming
    .find(
      (subscription) =>
        favorites.includes(`${countryCode}-${subscription.source}`),
    );

  return favoriteSubscriptionMatch;
}
