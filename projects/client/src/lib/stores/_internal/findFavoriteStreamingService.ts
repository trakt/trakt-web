import type { StreamingServiceOptions } from '../../requests/models/StreamingServiceOptions.ts';

type FindFavoriteStreamingServiceProps = {
  services: StreamingServiceOptions;
  favorites: string[];
  countryCode: string;
};

export function findFavoriteStreamingService({
  services,
  favorites,
  countryCode,
}: FindFavoriteStreamingServiceProps) {
  const favoriteSubscriptionMatch = services
    .streaming
    .find(
      (subscription) =>
        favorites.includes(`${countryCode}-${subscription.source}`),
    );

  return favoriteSubscriptionMatch;
}
