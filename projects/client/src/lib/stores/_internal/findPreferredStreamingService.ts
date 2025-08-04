import { getWebOSHandler } from '$lib/features/web-os/getWebOSHandler.ts';
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
  const streamNowServices = services
    .streaming
    .filter(
      (service) => {
        if (getWebOSHandler()) {
          return Boolean(service.webOSLink);
        }

        return true;
      },
    );

  const favoriteSubscriptionMatch = streamNowServices
    .find(
      (subscription) =>
        favorites.includes(`${countryCode}-${subscription.source}`),
    );

  return favoriteSubscriptionMatch ??
    findViablePreferredService(streamNowServices);
}
