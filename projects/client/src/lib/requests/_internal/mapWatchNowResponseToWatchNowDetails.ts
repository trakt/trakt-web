import type { WatchNowResponse } from '$lib/api.ts';
import type { WatchNowServices } from '../models/WatchNowServices.ts';

export function mapWatchNowResponseToWatchNowDetails(
  response: WatchNowResponse,
  country: string,
): WatchNowServices {
  const data = response[country];
  const subscriptionResponse = data?.subscription ?? [];

  const subscriptions = subscriptionResponse.map((subscription) => {
    return {
      link: `https://${subscription.link}`,
      source: `${country}-${subscription.source}`,
      is4k: subscription.uhd,
    };
  });

  return {
    subscriptions,
  };
}
