import type {
  StreamingServiceOptions,
  StreamNow,
} from '$lib/requests/models/StreamingServiceOptions.ts';

type FindPreferredStreamingServiceProps = {
  services: StreamingServiceOptions;
  favorites: string[];
  countryCode: string;
};

function findViablePreferredService(services: StreamNow[]) {
  // TODO we'll need to revisit and come up with a better heuristic
  return services.at(0);
}

export function findPreferredStreamingService({
  services,
  favorites,
  countryCode,
}: FindPreferredStreamingServiceProps) {
  const favoriteSubscriptionMatch = services.streaming
    .find(
      (subscription) =>
        favorites.includes(`${countryCode}-${subscription.source}`),
    );

  return favoriteSubscriptionMatch ??
    findViablePreferredService(services.streaming);
}
