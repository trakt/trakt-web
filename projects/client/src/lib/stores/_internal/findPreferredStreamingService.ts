import { getDeepLinkHandler } from '$lib/features/deep-link/getDeepLinkHandler.ts';
import type {
  StreamingServiceOptions,
} from '$lib/requests/models/StreamingServiceOptions.ts';

type FindPreferredStreamingServiceProps = {
  services: StreamingServiceOptions;
  favorites: string[];
  countryCode: string;
};

export function findPreferredStreamingService({
  services,
  favorites,
  countryCode,
}: FindPreferredStreamingServiceProps) {
  const streamNowServices = services
    .streaming
    .filter(
      (service) => {
        if (getDeepLinkHandler()) {
          return Boolean(service.deepLink);
        }

        return true;
      },
    );

  const favoriteSubscriptionMatch = streamNowServices
    .find(
      (subscription) =>
        favorites.includes(`${countryCode}-${subscription.source}`),
    );

  return favoriteSubscriptionMatch;
}
