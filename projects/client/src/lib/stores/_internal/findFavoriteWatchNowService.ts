import type { WatchNowServices } from '$lib/requests/models/WatchNowServices.ts';

type FindFavoriteWatchNowServiceProps = {
  services: WatchNowServices;
  favorites: string[];
};

export function findFavoriteWatchNowService({
  services,
  favorites,
}: FindFavoriteWatchNowServiceProps) {
  const favoriteSubscriptionMatch = services
    .subscriptions
    .find(
      (subscription) => favorites.includes(subscription.source),
    );

  return favoriteSubscriptionMatch;
}
